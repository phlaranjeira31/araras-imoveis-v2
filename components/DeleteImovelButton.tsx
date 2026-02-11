"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: string;
  title: string;
};

export default function DeleteImovelButton({ id, title }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    const ok = window.confirm(
      `Tem certeza que deseja remover este imóvel?\n\n"${title}"\n\nIsso vai apagar também as fotos relacionadas.`
    );
    if (!ok) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/imoveis/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Falha ao remover imóvel");
      }

      // atualiza a lista (Server Component refaz o findMany)
      router.refresh();
    } catch (err: any) {
      alert(err?.message || "Erro ao remover");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onDelete}
      disabled={loading}
      className="px-3 py-2 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-60"
      type="button"
      title="Remover imóvel"
    >
      {loading ? "Removendo..." : "Remover"}
    </button>
  );
}
