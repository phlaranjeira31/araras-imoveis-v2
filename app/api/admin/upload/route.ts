// app/api/admin/upload/route.ts
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs"; // ✅ precisa ser Node (pra usar fs)
export const dynamic = "force-dynamic";

function safeName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const files = form.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    // ✅ pasta pública onde o Next serve arquivos estáticos
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      if (!file || typeof file.arrayBuffer !== "function") continue;

      // (opcional) limite simples de tamanho: 50MB
      const maxBytes = 50 * 1024 * 1024;
      if (file.size > maxBytes) {
        return NextResponse.json(
          { error: `Arquivo muito grande: ${file.name}` },
          { status: 400 }
        );
      }

      const ext = path.extname(file.name || "").toLowerCase();
      const base = safeName(path.basename(file.name || "arquivo", ext));

      // nome único
      const unique = `${Date.now()}-${Math.random().toString(16).slice(2)}-${base}${ext}`;
      const absPath = path.join(uploadDir, unique);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await fs.writeFile(absPath, buffer);

      // ✅ URL que o site acessa
      urls.push(`/uploads/${unique}`);
    }

    return NextResponse.json({ urls }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Falha ao enviar arquivos." },
      { status: 500 }
    );
  }
}

