import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs"; // importante p/ fs funcionar

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
}

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

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
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

    // pasta: /public/uploads/imoveis/<imovelId>/
    const uploadDir = path.join(process.cwd(), "public", "uploads", "imoveis", id);
    await fs.mkdir(uploadDir, { recursive: true });

    const ext =
      file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";

    const base = sanitizeFileName(file.name.replace(/\.[^/.]+$/, ""));
    const filename = `${Date.now()}-${base}.${ext}`;

    const filepath = path.join(uploadDir, filename);

    await fs.writeFile(filepath, buffer);

    // URL pública (Next serve /public)
    const url = `/uploads/imoveis/${id}/${filename}`;

    // cria registro em Photo
    const photo = await prisma.photo.create({
      data: {
        url,
        imovelId: id,
      },
      select: { id: true, url: true },
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

