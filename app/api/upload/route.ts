
// app/api/upload/route.ts
import { NextResponse } from "next/server";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/upload" });
}

function extFrom(name: string, type: string) {
  const byName = path.extname(name || "").toLowerCase();
  if (byName) return byName;

  if (type === "image/jpeg") return ".jpg";
  if (type === "image/png") return ".png";
  if (type === "image/webp") return ".webp";
  if (type === "image/gif") return ".gif";
  if (type === "video/mp4") return ".mp4";
  if (type === "video/webm") return ".webm";
  return "";
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // ✅ pega QUALQUER File do form, independente do nome do campo
    const files: File[] = [];
    for (const [, value] of form.entries()) {
      if (value instanceof File) files.push(value);
    }

    if (!files.length) {
      return NextResponse.json(
        { error: "Nenhum arquivo recebido no FormData." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const saved: Array<{ url: string; type: "IMAGE" | "VIDEO"; name: string }> = [];

    for (const file of files) {
      const mime = file.type || "";
      const isImage = mime.startsWith("image/");
      const isVideo = mime.startsWith("video/");

      if (!isImage && !isVideo) {
        return NextResponse.json(
          { error: `Tipo não suportado: ${mime || "desconhecido"}` },
          { status: 400 }
        );
      }

      const buf = Buffer.from(await file.arrayBuffer());
      const ext = extFrom(file.name, mime);

      const id = crypto.randomBytes(16).toString("hex");
      const filename = `${id}${ext}`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buf);

      saved.push({
        url: `/uploads/${filename}`,
        type: isImage ? "IMAGE" : "VIDEO",
        name: file.name,
      });
    }

    return NextResponse.json({ files: saved }, { status: 201 });
  } catch (err: any) {
    console.error("UPLOAD_ERROR:", err);
    return NextResponse.json(
      { error: "Falha ao enviar arquivos.", details: String(err?.message || err) },
      { status: 500 }
    );
  }
}

