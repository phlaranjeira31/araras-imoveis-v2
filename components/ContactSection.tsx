"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Check,
  KeyRound,
  LoaderCircle,
  Send,
  WalletCards,
} from "lucide-react";

type FormState = {
  nome: string;
  email: string;
  telefone: string;
  pretensao: "COMPRAR" | "ALUGAR" | "VENDER" | "FINANCIAMENTO";
  mensagem: string;
  website: string;
};

const WHATSAPP_URL =
  "https://wa.me/5524988230138?text=Olá!%20Vim%20pelo%20site%20da%20Araras%20Imóveis%20e%20gostaria%20de%20mais%20informações.";

const PRETENSOES = [
  {
    value: "COMPRAR" as const,
    label: "Comprar",
    icon: Building2,
  },
  {
    value: "ALUGAR" as const,
    label: "Alugar",
    icon: KeyRound,
  },
  {
    value: "VENDER" as const,
    label: "Vender",
    icon: BadgeCheck,
  },
  {
    value: "FINANCIAMENTO" as const,
    label: "Financiamento",
    icon: WalletCards,
  },
];

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

  function setField<K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setOkMsg(null);
    setErrMsg(null);

    if (
      !form.nome.trim() ||
      !form.email.trim() ||
      !form.telefone.trim()
    ) {
      setErrMsg("Preencha Nome, E-mail e Telefone.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as {
        ok: boolean;
        message?: string;
      };

      if (!res.ok || !data.ok) {
        setErrMsg(
          data?.message || "Não foi possível enviar. Tente novamente."
        );
        return;
      }

      setOkMsg(
        "Mensagem enviada! Em breve entraremos em contato."
      );

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
    <section
      id="contato"
      className="mt-16 scroll-mt-28"
    >
      <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
        <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
          {/* APRESENTAÇÃO */}
          <div className="relative isolate overflow-hidden bg-[#365f4d] p-6 text-white sm:p-8 lg:p-9">
            {/* Elementos decorativos */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-white/[0.06] blur-2xl"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-20 -z-10 h-72 w-72 rounded-full bg-[#93ad7d]/20 blur-3xl"
            />

            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c5dcae]">
              Atendimento personalizado
            </p>

            <h2 className="mt-3 max-w-md text-3xl font-extrabold leading-tight tracking-tight sm:text-[34px]">
              Vamos encontrar o imóvel certo para você
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/80 sm:text-base">
              Conte o que procura e nossa equipe entrará em contato para
              apresentar oportunidades alinhadas às suas necessidades.
            </p>

            {/* DIFERENCIAIS */}
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Check className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-sm font-bold">
                    Atendimento próximo
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-white/65">
                    Conversa direta e acompanhamento personalizado.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Building2 className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-sm font-bold">
                    Compra, locação e venda
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-white/65">
                    Soluções para diferentes objetivos imobiliários.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <BadgeCheck className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-sm font-bold">
                    Conhecimento da região
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-white/65">
                    Especialistas em Petrópolis e na serra.
                  </p>
                </div>
              </div>
            </div>

            {/* WHATSAPP */}
            <a
  href={WHATSAPP_URL}
  target="_blank"
  rel="noopener noreferrer"
  className="group mt-6 flex min-h-12 w-full items-center justify-between rounded-2xl bg-white px-5 text-sm font-bold text-[#365f4d] shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-[#f5f8f2]"
>
  <span className="flex items-center gap-2">
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="currentColor"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path d="M19.11 17.21c-.27-.14-1.58-.78-1.82-.87-.24-.09-.42-.14-.6.14-.17.27-.69.87-.84 1.05-.16.18-.31.2-.58.07-.27-.14-1.12-.41-2.14-1.3-.79-.7-1.33-1.56-1.48-1.83-.16-.27-.02-.41.11-.54.12-.12.27-.31.4-.47.14-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.14-.6-1.45-.82-1.98-.22-.53-.44-.46-.6-.47h-.51c-.18 0-.47.07-.72.34-.24.27-.95.93-.95 2.27s.98 2.63 1.12 2.81c.13.18 1.91 2.92 4.63 4.09.65.28 1.16.45 1.56.58.65.21 1.24.18 1.71.11.52-.08 1.58-.65 1.8-1.28.22-.63.22-1.16.15-1.28-.06-.12-.24-.2-.51-.34Z" />
        <path d="M16.02 3.2c-7.07 0-12.8 5.71-12.8 12.76 0 2.25.59 4.45 1.71 6.39L3 29l6.83-1.78a12.84 12.84 0 0 0 6.18 1.58h.01c7.06 0 12.79-5.71 12.79-12.77 0-3.42-1.34-6.63-3.75-9.05A12.72 12.72 0 0 0 16.02 3.2Zm0 23.43h-.01a10.7 10.7 0 0 1-5.45-1.49l-.39-.23-4.05 1.06 1.08-3.95-.25-.4a10.59 10.59 0 0 1-1.64-5.64c0-5.87 4.8-10.65 10.71-10.65 2.86 0 5.54 1.11 7.56 3.12a10.58 10.58 0 0 1 3.13 7.53c0 5.88-4.81 10.65-10.69 10.65Z" />
      </svg>
    </span>

    Falar pelo WhatsApp
  </span>

  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
</a>

            <p className="mt-3 text-center text-xs text-white/55">
              Atendimento de segunda a sábado, das 9h às 18h.
            </p>
          </div>

          {/* FORMULÁRIO */}
          <div className="p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#668052]">
                  Conte o que você procura
                </p>

                <h3 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-950">
                  Solicite um atendimento
                </h3>
              </div>

              <p className="text-xs text-slate-400">
                <span className="text-red-500">*</span> Campos obrigatórios
              </p>
            </div>

            <form
              onSubmit={onSubmit}
              className="mt-5 space-y-4"
            >
              {/* HONEYPOT ANTISPAM */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
                value={form.website}
                onChange={(e) =>
                  setField("website", e.target.value)
                }
              />

              {/* NOME E TELEFONE */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block min-w-0">
                  <span className="text-sm font-semibold text-slate-800">
                    Nome <span className="text-red-500">*</span>
                  </span>

                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Digite seu nome"
                    value={form.nome}
                    onChange={(e) =>
                      setField("nome", e.target.value)
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#668052] focus:bg-white focus:ring-4 focus:ring-[#668052]/10"
                  />
                </label>

                <label className="block min-w-0">
                  <span className="text-sm font-semibold text-slate-800">
                    Telefone <span className="text-red-500">*</span>
                  </span>

                  <input
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="(24) 99999-9999"
                    value={form.telefone}
                    onChange={(e) =>
                      setField("telefone", e.target.value)
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#668052] focus:bg-white focus:ring-4 focus:ring-[#668052]/10"
                  />
                </label>
              </div>

              {/* E-MAIL */}
              <label className="block min-w-0">
                <span className="text-sm font-semibold text-slate-800">
                  E-mail <span className="text-red-500">*</span>
                </span>

                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Digite seu e-mail"
                  value={form.email}
                  onChange={(e) =>
                    setField("email", e.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#668052] focus:bg-white focus:ring-4 focus:ring-[#668052]/10"
                />
              </label>

              {/* PRETENSÃO */}
              <fieldset>
                <legend className="text-sm font-semibold text-slate-800">
                  Qual é o seu interesse?
                </legend>

                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PRETENSOES.map((item) => {
                    const Icon = item.icon;
                    const selected =
                      form.pretensao === item.value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          setField("pretensao", item.value)
                        }
                        className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-bold transition duration-200 ${
                          selected
                            ? "border-[#587249] bg-[#edf3e9] text-[#365f4d] shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-[#a6b699] hover:bg-slate-50 hover:text-[#365f4d]"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* MENSAGEM */}
              <label className="block min-w-0">
                <span className="text-sm font-semibold text-slate-800">
                  Mensagem
                </span>

                <textarea
                  rows={4}
                  placeholder="Conte um pouco sobre o imóvel que procura ou deseja anunciar..."
                  value={form.mensagem}
                  onChange={(e) =>
                    setField("mensagem", e.target.value)
                  }
                  className="mt-2 min-h-[108px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#668052] focus:bg-white focus:ring-4 focus:ring-[#668052]/10"
                />
              </label>

              {/* ERRO */}
              {errMsg && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {errMsg}
                </div>
              )}

              {/* SUCESSO */}
              {okMsg && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                >
                  {okMsg}
                </div>
              )}

              {/* ENVIO */}
              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-slate-400 sm:max-w-[280px]">
                  Ao enviar, você concorda em ser contatado pela Araras
                  Imóveis.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#365f4d] px-6 text-sm font-extrabold text-white shadow-[0_8px_22px_rgba(54,95,77,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#294c3c] hover:shadow-[0_12px_28px_rgba(54,95,77,0.28)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Enviar solicitação
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}