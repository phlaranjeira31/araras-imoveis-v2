"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleImovelAtivo(id: string) {
  const atual = await prisma.imovel.findUnique({
    where: { id },
    select: { ativo: true },
  });

  if (!atual) throw new Error("Imóvel não encontrado");

  await prisma.imovel.update({
    where: { id },
    data: { ativo: !atual.ativo },
  });

  revalidatePath("/admin/imoveis");
  revalidatePath("/");
  revalidatePath("/imoveis");
}