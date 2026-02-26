import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseMoneyToInt(value: any): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Math.round(value);

  const s = String(value).trim();
  if (!s) return null;

  const cleaned = s.replace(/[R$\s]/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number(cleaned);
  if (Number.isNaN(n)) return null;
  return Math.round(n);
}

function parseIntOrNull(v: any): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  if (Number.isNaN(n)) return null;
  return Math.trunc(n);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const imovel = await prisma.imovel.findUnique({
    where: { id },
    include: { photos: true },
  });

  if (!imovel) {
    return NextResponse.json({ error: "Imóvel não encontrado." }, { status: 404 });
  }

  const coverUrl = imovel.coverPhotoId
    ? imovel.photos.find((p) => p.id === imovel.coverPhotoId)?.url
    : null;

  return NextResponse.json({ imovel: { ...imovel, coverUrl } });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();

    // compatibilidade: PhotosUploader antigo manda { image: url|null }
    // -> converte para coverPhotoId usando o Photo.url
    let coverPhotoId: string | null | undefined = undefined;
    if ("image" in body) {
      const url = body?.image ? String(body.image) : "";
      if (!url) {
        coverPhotoId = null;
      } else {
        const photo = await prisma.photo.findFirst({
          where: { imovelId: id, url },
          select: { id: true },
        });
        coverPhotoId = photo?.id ?? null;
      }
    }

    const data: any = {};

    if (body?.title !== undefined) data.title = String(body.title).trim();
    if (body?.city !== undefined) data.city = String(body.city).trim();
    if (body?.neighborhood !== undefined)
      data.neighborhood = String(body.neighborhood).trim();
    if (body?.cep !== undefined) data.cep = body.cep ? String(body.cep).trim() : null;

    if (body?.street !== undefined)
      data.street = body.street ? String(body.street).trim() : null;
    if (body?.number !== undefined)
      data.number = body.number ? String(body.number).trim() : null;

    if (body?.lat !== undefined)
      data.lat = body.lat === "" || body.lat === null ? null : Number(body.lat);
    if (body?.lng !== undefined)
      data.lng = body.lng === "" || body.lng === null ? null : Number(body.lng);

    if (body?.price !== undefined) data.price = parseMoneyToInt(body.price);

    // novos campos
    if (body?.tipo !== undefined) data.tipo = body.tipo ? String(body.tipo).trim() : null;

    if (body?.quartos !== undefined) data.quartos = parseIntOrNull(body.quartos);
    if (body?.suites !== undefined) data.suites = parseIntOrNull(body.suites);
    if (body?.banheiros !== undefined) data.banheiros = parseIntOrNull(body.banheiros);
    if (body?.vagas !== undefined) data.vagas = parseIntOrNull(body.vagas);

    if (body?.areaConstruida !== undefined)
      data.areaConstruida = parseIntOrNull(body.areaConstruida);
    if (body?.areaTerreno !== undefined)
      data.areaTerreno = parseIntOrNull(body.areaTerreno);

    if (body?.mobiliado !== undefined)
      data.mobiliado =
        body.mobiliado === null || body.mobiliado === "" ? null : Boolean(body.mobiliado);

    if (body?.condominio !== undefined)
      data.condominio = parseMoneyToInt(body.condominio);
    if (body?.iptu !== undefined) data.iptu = parseMoneyToInt(body.iptu);

    if (body?.descricao !== undefined)
      data.descricao = body.descricao ? String(body.descricao).trim() : null;

    if (coverPhotoId !== undefined) {
      data.coverPhotoId = coverPhotoId;
    }

    const updated = await prisma.imovel.update({
      where: { id },
      data,
    });

    return NextResponse.json({ imovel: updated });
  } catch (e: any) {
    console.error("PATCH /api/imoveis/[id] error:", e);
    return NextResponse.json({ error: "Erro ao atualizar imóvel." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || id === "undefined") {
    return NextResponse.json({ error: "ID do imóvel não informado." }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1) remove referência da capa (evita FK quebrar)
      await tx.imovel.update({
        where: { id },
        data: { coverPhotoId: null },
      });

      // 2) apaga fotos
      await tx.photo.deleteMany({ where: { imovelId: id } });

      // 3) apaga o imóvel
      await tx.imovel.delete({ where: { id } });
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("DELETE /api/imoveis/[id] error:", e);
    return NextResponse.json(
      { error: "Erro ao apagar imóvel.", details: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}








