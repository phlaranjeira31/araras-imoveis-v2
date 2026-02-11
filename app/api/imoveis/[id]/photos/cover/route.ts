import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const photoId: string | null = body?.photoId ?? null;

  // se vier photoId, garante que essa photo pertence ao imovel
  if (photoId) {
    const photo = await prisma.photo.findFirst({
      where: { id: photoId, imovelId: id },
      select: { id: true },
    });

    if (!photo) {
      return NextResponse.json(
        { error: "Foto não encontrada para este imóvel." },
        { status: 404 }
      );
    }
  }

  await prisma.imovel.update({
    where: { id },
    data: { coverPhotoId: photoId },
  });

  return NextResponse.json({ ok: true });
}


