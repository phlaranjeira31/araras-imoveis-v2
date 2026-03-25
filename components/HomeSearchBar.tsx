"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TIPOS = [
  "Casa",
  "Casa em Condomínio",
  "Apartamento",
  "Cobertura",
  "Terreno",
  "Terreno em Condomínio",
  "Comercial",
];

export default function HomeSearchBar() {
  const router = useRouter();

  const [negocio, setNegocio] = useState("comprar");
  const [tipo, setTipo] = useState("");
  const [q, setQ] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (negocio) params.set("negocio", negocio);
    if (tipo) params.set("tipo", tipo);
    if (q.trim()) params.set("q", q.trim());

    router.push(`/imoveis?${params.toString()}`);
  }

  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl px-4">
        {/* SLOGAN */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow">
            Araras Imóveis
          </h2>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-white/90 drop-shadow">
            Seu imóvel na serra carioca!
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="
            w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm
            flex flex-col
            md:flex-row md:items-center
          "
        >
          {/* NEGOCIO */}
          <div className="relative w-full md:w-[220px]">
            <select
              value={negocio}
              onChange={(e) => setNegocio(e.target.value)}
              className="
                h-14 w-full bg-white pl-5 pr-14 text-[15px] font-medium text-slate-900
                border-b border-slate-200
                md:border-b-0 md:border-r
                appearance-none

                outline-none ring-0
                focus:outline-none focus:ring-0 focus:border-slate-300
              "
            >
              <option value="comprar">Comprar</option>
              <option value="alugar">Alugar</option>
              <option value="todos">Todos</option>
            </select>

            <svg
              className="pointer-events-none absolute right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* TIPO */}
          <div className="relative w-full md:w-[240px]">
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="
                h-14 w-full bg-white pl-5 pr-14 text-[15px] font-medium text-slate-900
                border-b border-slate-200
                md:border-b-0 md:border-r
                appearance-none

                outline-none ring-0
                focus:outline-none focus:ring-0 focus:border-slate-300
              "
            >
              <option value="">Tipo</option>
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <svg
              className="pointer-events-none absolute right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* INPUT + BOTÃO */}
          <div className="flex w-full items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Procure pela cidade, bairro ou código do imóvel"
              className="h-14 w-full bg-white px-5 text-[15px] text-slate-700 outline-none"
            />

            <button
              type="submit"
              className="
                mr-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#5a6b3f]
                shrink-0
              "
            >
              <svg viewBox="0 0 24 24" width="20" height="20" className="fill-white">
                <path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}







