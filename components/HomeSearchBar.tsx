"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  Home,
  MapPin,
  Search,
} from "lucide-react";

const TIPOS = [
  "Casa",
  "Casa em Condomínio",
  "Apartamento",
  "Cobertura",
  "Terreno",
  "Terreno em Condomínio",
  "Comercial",
  "Sítio",
  "Fazenda",
  "Galpão",
  "Loja",
  "Loft",
  "Apartamento Garden",
  "Studio",
];

const NEGOCIOS = [
  {
    label: "Comprar",
    value: "comprar",
  },
  {
    label: "Alugar",
    value: "alugar",
  },
  {
    label: "Todos",
    value: "todos",
  },
];

export default function HomeSearchBar() {
  const router = useRouter();

  const [negocio, setNegocio] = useState("comprar");
  const [tipo, setTipo] = useState("");
  const [openTipo, setOpenTipo] = useState(false);
  const [q, setQ] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenTipo(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenTipo(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (negocio) {
      params.set("negocio", negocio);
    }

    if (tipo) {
      params.set("tipo", tipo);
    }

    if (q.trim()) {
      params.set("q", q.trim());
    }

    router.push(`/imoveis?${params.toString()}`);
  }

  function selecionarTipo(novoTipo: string) {
    setTipo(novoTipo);
    setOpenTipo(false);
  }

  return (
    <section className="relative z-[80] w-full overflow-visible">
      <form
        onSubmit={onSubmit}
        className="relative z-[80] overflow-visible rounded-[24px] border border-white/40 bg-white/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl"
      >
        <div className="grid gap-2 lg:grid-cols-[250px_270px_minmax(0,1fr)_190px]">
          {/* FINALIDADE */}
          <div className="grid h-14 grid-cols-3 rounded-2xl bg-slate-100 p-1">
            {NEGOCIOS.map((item) => {
              const selecionado = negocio === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setNegocio(item.value)}
                  className={`rounded-xl px-2 text-sm font-semibold transition ${
                    selecionado
                      ? "bg-[#5a6b3f] text-white shadow-sm"
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* DROPDOWN PERSONALIZADO */}
          <div
            ref={dropdownRef}
            className="relative z-[100] overflow-visible"
          >
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={openTipo}
              onClick={() => setOpenTipo((aberto) => !aberto)}
              className={`flex h-14 w-full items-center justify-between rounded-2xl border bg-white px-4 text-left text-sm font-medium outline-none transition ${
                openTipo
                  ? "border-[#668052] ring-2 ring-[#668052]/15"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef4eb] text-[#5a6b3f]">
                  <Home className="h-4 w-4" />
                </span>

                <span className="truncate text-slate-800">
                  {tipo || "Tipo de imóvel"}
                </span>
              </span>

              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                  openTipo ? "rotate-180" : ""
                }`}
              />
            </button>

            {openTipo && (
              <div
                role="listbox"
                className="absolute left-0 top-[calc(100%+8px)] z-[200] w-full min-w-[270px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_22px_55px_rgba(15,23,42,0.22)] lg:w-[440px]"
              >
                <div className="border-b border-slate-100 bg-[#f8faf6] px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#667752]">
                    Escolha o tipo de imóvel
                  </p>
                </div>

                <div className="grid max-h-[310px] grid-cols-1 gap-1 overflow-y-auto p-2 sm:grid-cols-2">
                  <button
                    type="button"
                    role="option"
                    aria-selected={tipo === ""}
                    onClick={() => selecionarTipo("")}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition sm:col-span-2 ${
                      tipo === ""
                        ? "bg-[#eaf1e5] font-semibold text-[#496138]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>Todos os tipos</span>

                    {tipo === "" && <Check className="h-4 w-4" />}
                  </button>

                  {TIPOS.map((item) => {
                    const selecionado = tipo === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        role="option"
                        aria-selected={selecionado}
                        onClick={() => selecionarTipo(item)}
                        className={`flex min-h-11 items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                          selecionado
                            ? "bg-[#eaf1e5] font-semibold text-[#496138]"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>{item}</span>

                        {selecionado && <Check className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* PESQUISA */}
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#668052]" />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cidade, bairro ou código do imóvel"
              aria-label="Pesquisar por cidade, bairro ou código do imóvel"
              autoComplete="off"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white py-2 pl-12 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#668052] focus:ring-2 focus:ring-[#668052]/15"
            />
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#174f35] px-5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#103e29] hover:shadow-lg active:translate-y-0"
          >
            <Search className="h-5 w-5" />
            Buscar imóveis
          </button>
        </div>
      </form>
    </section>
  );
}