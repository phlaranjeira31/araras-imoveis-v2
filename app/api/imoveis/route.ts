// app/api/imoveis/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseMoneyToInt(value: any): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Math.round(value);

  const s = String(value).trim();
  if (!s) return null;

  const cleaned = s
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

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

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // básicos (mínimo pra criar)
    const title = String(body?.title ?? "").trim();
    const city = String(body?.city ?? "").trim();
    const neighborhood = String(body?.neighborhood ?? "").trim();

    if (!title || !city || !neighborhood) {
      return NextResponse.json(
        { error: "Preencha título, cidade e bairro." },
        { status: 400 }
      );
    }

    const slugBase =
      body?.slug && String(body.slug).trim()
        ? String(body.slug).trim()
        : slugify(`${title}-${neighborhood}-${city}`);

    // garante slug único
    let slug = slugBase;
    let i = 2;
    while (await prisma.imovel.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${i}`;
      i++;
      if (i > 50) break;
    }

    const data: any = {
      title,
      city,
      neighborhood,
      slug,
    };

    // ✅✅✅ ADICIONADO (ÚNICA MUDANÇA): salvar purpose corretamente
    if (body?.purpose !== undefined) {
      const p = String(body.purpose ?? "")
        .trim()
        .toLowerCase();

      // só aceitamos valores válidos; "todos" não deve ser salvo no banco
      if (p === "alugar") data.purpose = "alugar";
      else if (p === "comprar") data.purpose = "comprar";
      else if (p === "temporada") data.purpose = "temporada";
      else if (p === "lancamentos") data.purpose = "lancamentos";
      else data.purpose = "comprar"; // fallback seguro
    }

    // opcionais (se o form mandar, salvamos)
    if (body?.cep !== undefined) data.cep = body.cep ? String(body.cep).trim() : null;
    if (body?.street !== undefined) data.street = body.street ? String(body.street).trim() : null;
    if (body?.number !== undefined) data.number = body.number ? String(body.number).trim() : null;

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

    if (body?.condominio !== undefined) data.condominio = parseMoneyToInt(body.condominio);
    if (body?.iptu !== undefined) data.iptu = parseMoneyToInt(body.iptu);

    if (body?.descricao !== undefined)
      data.descricao = body.descricao ? String(body.descricao).trim() : null;

    // ✅✅✅ ADICIONADO: nome do condomínio (texto)
    if (body?.condominioNome !== undefined)
      data.condominioNome = body.condominioNome ? String(body.condominioNome).trim() : null;

    // ✅✅✅ ADICIONADO: código do imóvel (único)
    if (body?.codigo !== undefined) {
      const codigo = body.codigo ? String(body.codigo).trim() : null;
      data.codigo = codigo;

      // se veio código, garantimos que não repete (mensagem clara)
      if (codigo) {
        const exists = await prisma.imovel.findUnique({ where: { codigo } });
        if (exists) {
          return NextResponse.json(
            { error: "Código do imóvel já existe. Escolha outro." },
            { status: 400 }
          );
        }
      }
    }

    // ✅✅✅ ADICIONADO: área do proprietário
    if (body?.proprietarioNome !== undefined)
      data.proprietarioNome = body.proprietarioNome
        ? String(body.proprietarioNome).trim()
        : null;

    if (body?.proprietarioTelefone !== undefined)
      data.proprietarioTelefone = body.proprietarioTelefone
        ? String(body.proprietarioTelefone).trim()
        : null;

    if (body?.proprietarioCpf !== undefined)
      data.proprietarioCpf = body.proprietarioCpf
        ? String(body.proprietarioCpf).trim()
        : null;

    if (body?.proprietarioEmail !== undefined)
      data.proprietarioEmail = body.proprietarioEmail
        ? String(body.proprietarioEmail).trim()
        : null;

    const created = await prisma.imovel.create({
      data,
    });

    return NextResponse.json({ imovel: created }, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/imoveis error:", e);

    // ✅ ADICIONADO: fallback pra erro de unique (caso passe pelo check e o Prisma bloqueie)
    const msg = String(e?.message || "");
    if (msg.toLowerCase().includes("unique") && msg.toLowerCase().includes("codigo")) {
      return NextResponse.json(
        { error: "Código do imóvel já existe. Escolha outro." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao salvar imóvel." },
      { status: 500 }
    );
  }
}














