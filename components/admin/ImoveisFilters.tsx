"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  tipos: string[];
};

export default function ImoveisFilters({ tipos }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initial = useMemo(() => {
    const get = (k: string) => searchParams.get(k) || "";
    return {
      tipo: get("tipo"),
      codigo: get("codigo"),
      bairro: get("bairro"),
      condominio: get("condominio"),
      proprietario: get("proprietario"),
      telefone: get("telefone"),
      min: get("min"),
      max: get("max"),
      corretoraCaptacao: get("corretoraCaptacao"), // ✅ ADICIONADO
    };
  }, [searchParams]);

  const [form, setForm] = useState(initial);

  function setField(key: keyof typeof form, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function apply() {
    const params = new URLSearchParams();
    Object.entries(form).forEach(([k, v]) => {
      if (v && v.trim().length) params.set(k, v.trim());
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  function clear() {
    router.push(pathname);
  }

  const exportHref = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(form).forEach(([k, v]) => {
      if (v && v.trim().length) params.set(k, v.trim());
    });
    return `/admin/imoveis/export?${params.toString()}`;
  }, [form]);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Tipo de imóvel</label>
          <select
            className="h-10 rounded-xl border px-3 text-sm"
            value={form.tipo}
            onChange={(e) => setField("tipo", e.target.value)}
          >
            <option value="">Todos</option>
            {tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Código do imóvel</label>
          <input
            className="h-10 rounded-xl border px-3 text-sm"
            placeholder="Ex: AR-102"
            value={form.codigo}
            onChange={(e) => setField("codigo", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Bairro</label>
          <input
            className="h-10 rounded-xl border px-3 text-sm"
            placeholder="Ex: Itaipava"
            value={form.bairro}
            onChange={(e) => setField("bairro", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Condomínio</label>
          <input
            className="h-10 rounded-xl border px-3 text-sm"
            placeholder="Nome do condomínio"
            value={form.condominio}
            onChange={(e) => setField("condominio", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Nome do proprietário</label>
          <input
            className="h-10 rounded-xl border px-3 text-sm"
            placeholder="Ex: João"
            value={form.proprietario}
            onChange={(e) => setField("proprietario", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Telefone</label>
          <input
            className="h-10 rounded-xl border px-3 text-sm"
            placeholder="Ex: 21 99999-9999"
            value={form.telefone}
            onChange={(e) => setField("telefone", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Valor mín.</label>
          <input
            className="h-10 rounded-xl border px-3 text-sm"
            inputMode="numeric"
            placeholder="Ex: 500000"
            value={form.min}
            onChange={(e) => setField("min", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Valor máx.</label>
          <input
            className="h-10 rounded-xl border px-3 text-sm"
            inputMode="numeric"
            placeholder="Ex: 3000000"
            value={form.max}
            onChange={(e) => setField("max", e.target.value)}
          />
        </div>

        {/* 🔥 NOVO CAMPO (CORRETORA LIVRE) */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">
            Corretora (captação)
          </label>
          <input
            type="text"
            className="h-10 rounded-xl border px-3 text-sm"
            placeholder="Digite o nome da corretora"
            value={form.corretoraCaptacao}
            onChange={(e) => setField("corretoraCaptacao", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={apply}
          className="h-10 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Aplicar filtros
        </button>
        <button
          onClick={clear}
          className="h-10 rounded-xl border px-4 text-sm font-semibold hover:bg-slate-50"
        >
          Limpar
        </button>

        <a
          href={exportHref}
          className="ml-auto h-10 rounded-xl border px-4 text-sm font-semibold hover:bg-slate-50"
        >
          Exportar CSV
        </a>
      </div>
    </div>
  );
}
