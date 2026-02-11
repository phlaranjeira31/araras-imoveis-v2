"use client";

import { useState } from "react";
import Image from "next/image";

type FormState = {
  nome: string;
  email: string;
  telefone: string;
  pretensao: "COMPRAR" | "ALUGAR" | "VENDER" | "FINANCIAMENTO";
  mensagem: string;
  website: string; // honeypot anti-spam (deve ficar vazio)
};

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    nome: "",
    email: "",
    telefone: "",
    pretensao: "COMPRAR",
    mensagem: "",
    website: "",
  });

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOkMsg(null);
    setErrMsg(null);

    if (!form.nome.trim() || !form.email.trim() || !form.telefone.trim()) {
      setErrMsg("Preencha Nome, E-mail e Telefone.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as { ok: boolean; message?: string };

      if (!res.ok || !data.ok) {
        setErrMsg(data?.message || "Não foi possível enviar. Tente novamente.");
        return;
      }

      setOkMsg("Mensagem enviada! Em breve entraremos em contato.");
      setForm({
        nome: "",
        email: "",
        telefone: "",
        pretensao: "COMPRAR",
        mensagem: "",
        website: "",
      });
    } catch {
      setErrMsg("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contato" className="mt-16 scroll-mt-24">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-10 overflow-hidden">
        <div className="grid gap-8 md:gap-10 md:grid-cols-2 md:items-start min-w-0">
          {/* Texto */}
          <div className="min-w-0">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Entre em contato
            </h2>

            <p className="mt-3 text-slate-600">
              Preencha o formulário e nossa equipe retornará o contato.
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm text-slate-700">
                <span className="text-red-500">*</span> Campos com asterisco são obrigatórios
              </div>

              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>• Atendimento rápido!</li>
                <li>• Compra</li>
                <li>• Aluguel</li>
                <li>• Venda</li>
                <li>• Financiamento</li>
              </ul>
            </div>

            {/* Marca d'água (apenas desktop) */}
            <div className="mt-8 hidden md:flex items-center justify-center">
              <div className="relative h-[220px] w-full max-w-[520px]">
                <Image
                  src="/brand/watermark.png"
                  alt="Araras Imóveis"
                  fill
                  className="object-contain opacity-[0.10]"
                  priority={false}
                />
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="min-w-0 w-full">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 w-full">
              <form onSubmit={onSubmit} className="space-y-5">
                {/* honeypot invisível */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  value={form.website}
                  onChange={(e) => setField("website", e.target.value)}
                />

                <div className="grid gap-4 md:grid-cols-2 min-w-0">
                  <label className="block min-w-0">
                    <span className="text-sm font-semibold text-slate-800">
                      Nome <span className="text-red-500">*</span>
                    </span>
                    <input
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                      placeholder="Digite seu nome"
                      value={form.nome}
                      onChange={(e) => setField("nome", e.target.value)}
                    />
                  </label>

                  <label className="block min-w-0">
                    <span className="text-sm font-semibold text-slate-800">
                      Telefone <span className="text-red-500">*</span>
                    </span>
                    <input
                      type="tel"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                      placeholder="(24) 99999-9999"
                      value={form.telefone}
                      onChange={(e) => setField("telefone", e.target.value)}
                    />
                  </label>
                </div>

                <label className="block min-w-0">
                  <span className="text-sm font-semibold text-slate-800">
                    E-mail <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="email"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                    placeholder="Digite seu e-mail"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                  />
                </label>

                <div className="min-w-0">
                  <span className="text-sm font-semibold text-slate-800">Pretensão:</span>

                  {/* No mobile vira “quebrável” (wrap) pra não estourar */}
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setField("pretensao", "COMPRAR")}
                      className={[
                        "rounded-full px-5 py-2 text-sm font-semibold transition",
                        form.pretensao === "COMPRAR"
                          ? "bg-primary text-white"
                          : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      Comprar
                    </button>

                    <button
                      type="button"
                      onClick={() => setField("pretensao", "ALUGAR")}
                      className={[
                        "rounded-full px-5 py-2 text-sm font-semibold transition",
                        form.pretensao === "ALUGAR"
                          ? "bg-primary text-white"
                          : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      Alugar
                    </button>

                    <button
                      type="button"
                      onClick={() => setField("pretensao", "VENDER")}
                      className={[
                        "rounded-full px-5 py-2 text-sm font-semibold transition",
                        form.pretensao === "VENDER"
                          ? "bg-primary text-white"
                          : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      Vender
                    </button>

                    <button
                      type="button"
                      onClick={() => setField("pretensao", "FINANCIAMENTO")}
                      className={[
                        "rounded-full px-5 py-2 text-sm font-semibold transition",
                        form.pretensao === "FINANCIAMENTO"
                          ? "bg-primary text-white"
                          : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      Financiamento
                    </button>
                  </div>
                </div>

                <label className="block min-w-0">
                  <span className="text-sm font-semibold text-slate-800">Mensagem:</span>
                  <textarea
                    className="mt-2 min-h-[140px] w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                    placeholder="Digite sua mensagem"
                    value={form.mensagem}
                    onChange={(e) => setField("mensagem", e.target.value)}
                  />
                </label>

                {errMsg && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errMsg}
                  </div>
                )}

                {okMsg && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {okMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-full bg-primary px-6 py-4 text-sm font-extrabold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Enviando..." : "Enviar"}
                </button>

                <p className="text-center text-xs text-slate-500">
                  Ao enviar, você concorda em ser contatado pela Araras Imóveis.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




