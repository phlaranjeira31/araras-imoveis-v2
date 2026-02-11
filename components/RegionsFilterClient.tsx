
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Item = {
  city: string;
  neighborhood: string;
  count: number;
};

export default function RegionsFilterClient({
  items,
  cities,
}: {
  items: Item[];
  cities: string[];
}) {
  const [citySelected, setCitySelected] = useState("");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const qn = q.trim().toLowerCase();
    return items.filter((it) => {
      const okCity = !citySelected || it.city === citySelected;
      const label = `${it.neighborhood} • ${it.city}`.toLowerCase();
      const okQ = !qn || label.includes(qn);
      return okCity && okQ;
    });
  }, [items, citySelected, q]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-[280px_1fr] md:items-center">
        <select
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm"
          value={citySelected}
          onChange={(e) => setCitySelected(e.target.value)}
        >
          <option value="">Todas as cidades</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
          placeholder="Buscar bairro ou cidade..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {filtered.map((item) => {
          const label = `${item.neighborhood} • ${item.city}`;

          // ✅ link correto: SUA PAGE /imoveis entende "bairro"
          const href = `/imoveis?bairro=${encodeURIComponent(
            item.neighborhood
          )}`;

          return (
            <Link
              key={`${item.city}|||${item.neighborhood}`}
              href={href}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              <span>{label}</span>
              <span className="ml-1 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-bold text-slate-700">
                {item.count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}



