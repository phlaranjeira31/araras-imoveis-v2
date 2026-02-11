"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function DeleteImovelButton({
  id,
  title,
}: {
  id: string;
  title?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    try {
      const res = await fetch(`/api/imoveis/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Falha ao apagar imóvel");
      }

      startTransition(() => {
        router.push("/admin/imoveis");
        router.refresh();
      });
    } catch (e) {
      alert("Erro ao apagar imóvel. Veja o terminal.");
      console.error(e);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
      >
        Apagar imóvel
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900">
              Apagar imóvel?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Isso vai remover o imóvel do site e do painel.
              {title ? (
                <>
                  <br />
                  <span className="font-semibold text-slate-900">
                    {title}
                  </span>
                </>
              ) : null}
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                disabled={isPending}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                disabled={isPending}
              >
                {isPending ? "Apagando..." : "Sim, apagar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

