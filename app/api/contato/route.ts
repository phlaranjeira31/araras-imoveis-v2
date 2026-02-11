import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type Body = {
  nome?: string;
  email?: string;
  telefone?: string;
  pretensao?: string;
  mensagem?: string;
  website?: string; // honeypot
};

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    // Honeypot anti-spam
    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const nome = String(body.nome ?? "").trim();
    const email = String(body.email ?? "").trim();
    const telefone = String(body.telefone ?? "").trim();
    const pretensao = String(body.pretensao ?? "").trim();
    const mensagem = String(body.mensagem ?? "").trim();

    if (!nome || !email || !telefone) {
      return NextResponse.json(
        { ok: false, message: "Preencha Nome, E-mail e Telefone." },
        { status: 400 }
      );
    }

    if (!isEmail(email)) {
      return NextResponse.json(
        { ok: false, message: "E-mail inválido." },
        { status: 400 }
      );
    }

    if (!mensagem) {
      return NextResponse.json(
        { ok: false, message: "Digite uma mensagem." },
        { status: 400 }
      );
    }

    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      CONTACT_TO_EMAIL,
      CONTACT_FROM_EMAIL,
    } = process.env;

    if (
      !SMTP_HOST ||
      !SMTP_PORT ||
      !SMTP_USER ||
      !SMTP_PASS ||
      !CONTACT_TO_EMAIL ||
      !CONTACT_FROM_EMAIL
    ) {
      return NextResponse.json(
        { ok: false, message: "Servidor sem configuração de e-mail." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: false, // TLS
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `Novo contato — ${pretensao || "Site"} — ${nome}`,
      text: `
Novo contato pelo site Araras Imóveis

Nome: ${nome}
E-mail: ${email}
Telefone: ${telefone}
Pretensão: ${pretensao || "-"}

Mensagem:
${mensagem}
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Erro ao enviar e-mail." },
      { status: 500 }
    );
  }
}


