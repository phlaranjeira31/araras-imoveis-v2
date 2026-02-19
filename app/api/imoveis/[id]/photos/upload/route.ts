import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

/** Mantém seu sanitize (não quebra nada) */
function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uploadToCloudinary(buffer: Buffer, options: any) {
  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}

/**
 * Fallback: se um dia algum registro antigo não tiver publicId,
 * tenta extrair um public_id “provável” da URL do Cloudinary.
 * (Ainda assim: o ideal é ter publicId salvo sempre.)
 */
function tryExtractPublicIdFromCloudinaryUrl(url: string): string | null {
  try {
    // Exemplo:
    // https://res.cloudinary.com/<cloud>/image/upload/v123/araras-imoveis/imoveis/<id>/<filename>.jpg
    const m = url.match(/\/upload\/(?:v\d+\/)?(.+)\.(?:jpg|jpeg|png|webp|avif)$/i);
    if (!m?.[1]) return null;
    return m[1];
  } catch {
    return null;
  }
}

/**
 * Remove a imagem do Cloudinary, se tiver publicId ou conseguir extrair.
 * invalidate: pede pro CDN “esquecer” cache.
 */
async function deleteFromCloudinary(photo: { publicId: string | null; url: string }) {
  const publicId = photo.publicId || tryExtractPublicIdFromCloudinaryUrl(photo.url);
  if (!publicId) return { skipped: true };

  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });
    return { skipped: false, res };
  } catch (err) {
    // Não vamos “quebrar” a remoção do banco por causa disso,
    // mas retornamos erro pra você ver no console.
    console.error("CLOUDINARY DESTROY ERROR:", err);
    return { skipped: false, error: err };
  }
}

/**
 * POST = upload de foto
 * Continua igual ao seu, só adiciona:
 * - limite de fotos por imóvel (bem alto, configurável)
 * - salva publicId no banco
 * - transform/quality auto já está
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Imóvel inválido." }, { status: 400 });
    }

    // garante que o imóvel existe
    const exists = await prisma.imovel.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      return NextResponse.json({ error: "Imóvel não encontrado." }, { status: 404 });
    }

    // ✅ limite de quantidade (alto, pra não te travar)
    const MAX_PHOTOS_PER_IMOVEL = Number(process.env.MAX_PHOTOS_PER_IMOVEL || 200);
    const currentCount = await prisma.photo.count({ where: { imovelId: id } });
    if (currentCount >= MAX_PHOTOS_PER_IMOVEL) {
      return NextResponse.json(
        { error: `Limite de fotos atingido (${MAX_PHOTOS_PER_IMOVEL}).` },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
    }

    // ✅ limite de tamanho
    const MAX_MB = Number(process.env.MAX_UPLOAD_MB || 10);
    if (file.size > MAX_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `Arquivo muito grande. Máximo ${MAX_MB}MB.` },
        { status: 400 }
      );
    }

    // valida tipo
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato inválido. Use JPG, PNG ou WEBP." },
        { status: 400 }
      );
    }

    // lê bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base = sanitizeFileName(file.name.replace(/\.[^/.]+$/, ""));
    const filename = `${Date.now()}-${base}`; // sem extensão (Cloudinary gerencia)
    const publicId = `${id}/${filename}`;

    // ✅ upload Cloudinary (com otimização)
    const result = await uploadToCloudinary(buffer, {
      folder: "araras-imoveis/imoveis",
      public_id: publicId,
      resource_type: "image",
      overwrite: false,

      // ✅ otimiza e economiza limite
      quality: "auto",
      fetch_format: "auto",

      // ✅ limita dimensões (não estoura tamanho)
      transformation: [{ width: 2000, crop: "limit" }],
    });

    const url = result.secure_url as string;
    const savedPublicId = result.public_id as string;

    // ✅ cria registro em Photo (salvando publicId)
    const photo = await prisma.photo.create({
      data: {
        url,
        publicId: savedPublicId, // precisa existir no schema.prisma
        imovelId: id,
      },
      select: { id: true, url: true, publicId: true },
    });

    // se ainda não tem capa, define a primeira como capa automaticamente
    const imovel = await prisma.imovel.findUnique({
      where: { id },
      select: { coverPhotoId: true },
    });

    if (!imovel?.coverPhotoId) {
      await prisma.imovel.update({
        where: { id },
        data: { coverPhotoId: photo.id },
      });
    }

    return NextResponse.json({ ok: true, photo });
  } catch (e: any) {
    console.error("UPLOAD ERROR:", e);
    return NextResponse.json(
      { error: e?.message ? `Erro ao fazer upload: ${e.message}` : "Erro ao fazer upload." },
      { status: 500 }
    );
  }
}

/**
 * DELETE = remove foto do Cloudinary + banco
 * Espera query param: ?photoId=...
 * (Assim você consegue chamar do botão "Remover")
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Imóvel inválido." }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const photoId = searchParams.get("photoId");
    if (!photoId) {
      return NextResponse.json({ error: "photoId é obrigatório." }, { status: 400 });
    }

    // pega a foto (e confirma que é do imóvel)
    const photo = await prisma.photo.findFirst({
      where: { id: photoId, imovelId: id },
      select: { id: true, url: true, publicId: true },
    });

    if (!photo) {
      return NextResponse.json({ error: "Foto não encontrada." }, { status: 404 });
    }

    // checa se é capa
    const imovel = await prisma.imovel.findUnique({
      where: { id },
      select: { coverPhotoId: true },
    });

    const wasCover = imovel?.coverPhotoId === photo.id;

    // tenta apagar do Cloudinary (não quebra se falhar)
    await deleteFromCloudinary({ publicId: photo.publicId ?? null, url: photo.url });

    // apaga no banco e ajusta capa se necessário
    await prisma.$transaction(async (tx) => {
      await tx.photo.delete({ where: { id: photo.id } });

      if (wasCover) {
        const nextCover = await tx.photo.findFirst({
          where: { imovelId: id },
          orderBy: { createdAt: "asc" }, // primeira que sobrar vira capa
          select: { id: true },
        });

        await tx.imovel.update({
          where: { id },
          data: { coverPhotoId: nextCover?.id ?? null },
        });
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("DELETE PHOTO ERROR:", e);
    return NextResponse.json(
      { error: e?.message ? `Erro ao remover: ${e.message}` : "Erro ao remover." },
      { status: 500 }
    );
  }
}

/**
 * PATCH = define foto como capa
 * Espera query param: ?photoId=...
 * (Seu botão "Definir como capa" chama isso)
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Imóvel inválido." }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const photoId = searchParams.get("photoId");
    if (!photoId) {
      return NextResponse.json({ error: "photoId é obrigatório." }, { status: 400 });
    }

    // garante que foto é desse imóvel
    const photo = await prisma.photo.findFirst({
      where: { id: photoId, imovelId: id },
      select: { id: true },
    });

    if (!photo) {
      return NextResponse.json({ error: "Foto não encontrada." }, { status: 404 });
    }

    await prisma.imovel.update({
      where: { id },
      data: { coverPhotoId: photo.id },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("SET COVER ERROR:", e);
    return NextResponse.json(
      { error: e?.message ? `Erro ao definir capa: ${e.message}` : "Erro ao definir capa." },
      { status: 500 }
    );
  }
}




