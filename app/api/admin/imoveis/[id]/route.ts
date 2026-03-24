import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();

    const priceRaw = String(body?.price ?? "").trim();
    const price =
      priceRaw === ""
        ? null
        : Number(String(priceRaw).replace(/[^\d]/g, ""));

    if (priceRaw !== "" && (price == null || Number.isNaN(price))) {
      return NextResponse.json(
        { error: "Preço inválido. Use apenas números (ex: 2800000)." },
        { status: 400 }
      );
    }

    // ✅ ADICIONADO (corretora)
    const corretoraRaw = String(body?.corretoraCaptacao ?? "").trim();
    const corretoraCaptacao =
      !corretoraRaw || corretoraRaw === "Todas" ? null : corretoraRaw;

    // ✅ ADICIONADO (condomínio)
    const condominioRaw = String(body?.condominio ?? "").trim();
    const condominio =
      condominioRaw === ""
        ? null
        : Number(String(condominioRaw).replace(/[^\d]/g, ""));

    // ✅ ADICIONADO (IPTU)
    const iptuRaw = String(body?.iptu ?? "").trim();
    const iptu =
      iptuRaw === ""
        ? null
        : Number(String(iptuRaw).replace(/[^\d]/g, ""));

    const data: any = {
      title: String(body?.title ?? "").trim() || null,
      slug: String(body?.slug ?? "").trim() || null,
      city: String(body?.city ?? "").trim() || null,
      neighborhood: String(body?.neighborhood ?? "").trim() || null,
      cep: String(body?.cep ?? "").trim() || null,
      tipo: String(body?.tipo ?? "").trim() || null,
      purpose: String(body?.purpose ?? "").trim() || null,
      descricao: String(body?.descricao ?? "").trim() || null,
      proprietarioNome: String(body?.proprietarioNome ?? "").trim() || null,
      proprietarioTelefone: String(body?.proprietarioTelefone ?? "").trim() || null,
      condominioNome: String(body?.condominioNome ?? "").trim() || null,
      codigo: String(body?.codigo ?? "").trim() || null,
      endereco: String(body?.endereco ?? "").trim() || null,

      // ✅ ADICIONADO (salva no banco)
      corretoraCaptacao,

      // ✅ ADICIONADO (salva condomínio e IPTU)
      condominio,
      iptu,
    };

    if (priceRaw === "") {
      data.price = null;
    } else {
      data.price = price;
    }

    await prisma.imovel.update({
      where: { id },
      data,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Erro ao atualizar imóvel." },
      { status: 500 }
    );
  }
}