
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const imovel = await prisma.imovel.findUnique({
    where: { id },
    select: {
      coverPhotoId: true,
      photos: {
        select: { id: true, url: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return NextResponse.json({
    photos: imovel?.photos || [],
    coverPhotoId: imovel?.coverPhotoId ?? null,
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const photoId: string | undefined = body?.photoId;

  if (!photoId) {
    return NextResponse.json({ error: "photoId é obrigatório." }, { status: 400 });
  }

  const imovel = await prisma.imovel.findUnique({
    where: { id },
    select: { coverPhotoId: true },
  });

  // apaga a foto (garantindo que pertence ao imóvel)
  await prisma.photo.delete({
    where: { id: photoId },
  });

  // se apagou a capa, limpa a capa
  if (imovel?.coverPhotoId === photoId) {
    await prisma.imovel.update({
      where: { id },
      data: { coverPhotoId: null },
    });
  }

  return NextResponse.json({ ok: true });
}


