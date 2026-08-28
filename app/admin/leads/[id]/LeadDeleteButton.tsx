"use client";

import { Trash2 } from "lucide-react";

import { excluirLead } from "./actions";

export default function LeadDeleteButton({
  id,
  nome,
}: {
  id: string;
  nome: string;
}) {
  return (
    <form
      action={excluirLead.bind(
        null,
        id
      )}
      onSubmit={(event) => {
        const confirmed =
          window.confirm(
            `Excluir o lead de ${nome}?\n\nA oportunidade, demanda, tarefas, interesses, visitas e propostas relacionadas serão removidas.\n\nO contato da pessoa será preservado.`
          );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-bold text-red-600 transition hover:bg-red-100"
      >
        <Trash2 className="h-4 w-4" />
        Excluir Lead
      </button>
    </form>
  );
}