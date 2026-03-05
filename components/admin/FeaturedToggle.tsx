"use client";

import { useState } from "react";

type Props = {
  id: string;
  initialFeatured: boolean;
};

export default function FeaturedToggle({ id, initialFeatured }: Props) {
  const [featured, setFeatured] = useState(initialFeatured);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    const next = !featured;
    setLoading(true);

    const res = await fetch(`/api/admin/imoveis/${id}/featured`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: next }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      alert(data?.error || "Erro ao atualizar destaque.");
      return;
    }

    setFeatured(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition
      ${
        featured
          ? "bg-emerald-600 text-white border-emerald-600"
          : "bg-white hover:bg-neutral-50 border-neutral-200"
      } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {featured ? "Destaque" : "Destacar"}
    </button>
  );
}