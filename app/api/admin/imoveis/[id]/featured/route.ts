import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();
    const featured = Boolean(body?.featured);

    // Se for marcar como destaque, aplica limite
    if (featured) {
      const count = await prisma.imovel.count({
        where: { featured: true },
      });

      // se já tem 10 destaques e esse imóvel ainda não é destaque -> bloqueia
      const already = await prisma.imovel.findUnique({
        where: { id },
        select: { featured: true },
      });

      if (!already) {
        return NextResponse.json({ error: "Imóvel não encontrado." }, { status: 404 });
      }

      if (!already.featured && count >= 10) {
        return NextResponse.json(
          { error: "Limite de 10 imóveis em destaque atingido." },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.imovel.update({
      where: { id },
      data: {
        featured,
        featuredAt: featured ? new Date() : null,
      },
      select: { id: true, featured: true, featuredAt: true },
    });

    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Erro ao atualizar destaque." }, { status: 500 });
  }
}