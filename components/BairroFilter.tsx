"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  bairros: string[];
};

function normalizeText(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function BairroFilter({ bairros }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const bairroAtual = searchParams.get("bairro") ?? "";
  const [q, setQ] = useState("");

  const bairrosFiltrados = useMemo(() => {
    const nq = normalizeText(q);
    if (!nq) return bairros;
    return bairros.filter((b) => normalizeText(b).includes(nq));
  }, [bairros, q]);

  function setBairro(bairro: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!bairro || bairro === "Todos") {
      params.delete("bairro");
    } else {
      params.set("bairro", bairro);
    }

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function limpar() {
    setQ("");
    setBairro("Todos");
  }

  return (
    <div className="mt-6 rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex-1">
          <label className="text-sm font-semibold text-slate-800">
            Filtrar por bairro
          </label>

          <div className="mt-2 grid gap-3 md:grid-cols-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Digite para buscar (ex: Itaipava)"
              className="h-11 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
            />

            <select
              value={bairroAtual || "Todos"}
              onChange={(e) => setBairro(e.target.value)}
              className="h-11 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="Todos">Todos</option>
              {bairrosFiltrados.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {bairroAtual ? (
            <p className="mt-2 text-xs text-slate-500">
              Mostrando resultados para:{" "}
              <span className="font-semibold text-slate-700">{bairroAtual}</span>
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-500">
              Mostrando: <span className="font-semibold">todos os bairros</span>
            </p>
          )}
        </div>

        <button
          onClick={limpar}
          className="h-11 rounded-xl border px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          type="button"
        >
          Limpar filtro
        </button>
      </div>
    </div>
  );
}
