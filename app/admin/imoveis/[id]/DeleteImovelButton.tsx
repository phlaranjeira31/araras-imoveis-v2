
"use client";

import { useRouter, useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function DeleteImovelButton({ imovelId }: { imovelId?: string }) {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);

  // pega o id do URL como fallback (isso elimina "undefined" vindo do props)
  const finalId = useMemo(() => {
    const fromUrl = params?.id;
    const urlId =
      typeof fromUrl === "string" ? fromUrl : Array.isArray(fromUrl) ? fromUrl[0] : undefined;

    return (imovelId && imovelId !== "undefined" ? imovelId : urlId) ?? "";
  }, [imovelId, params]);

  async function handleDelete() {
    if (!finalId || finalId === "undefined") {
      alert(`ID inválido. (finalId="${finalId}")\nRecarregue a página e tente novamente.`);
      return;
    }

    const ok = confirm(
      "Tem certeza que deseja APAGAR este imóvel?\n\nIsso remove do site e NÃO TEM COMO DESFAZER."
    );
    if (!ok) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/imoveis/${encodeURIComponent(finalId)}`, {
        method: "DELETE",
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = { raw: text };
      }

      if (!res.ok) {
        alert(
          `Erro ao apagar imóvel.\nStatus: ${res.status}\n\n${JSON.stringify(data, null, 2)}`
        );
        return;
      }

      alert("Imóvel apagado com sucesso!");
      router.push("/admin/imoveis");
      router.refresh();
    } catch (e: any) {
      alert(`Erro inesperado ao apagar imóvel.\n\n${e?.message ?? String(e)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`rounded-lg px-4 py-2 text-sm text-white ${
        loading ? "bg-red-300" : "bg-red-600 hover:bg-red-700"
      }`}
      title={`finalId: ${finalId || "(vazio)"}`}
    >
      {loading ? "Apagando..." : "Apagar imóvel"}
    </button>
  );
}
