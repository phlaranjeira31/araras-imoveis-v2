"use client";

import { useTransition } from "react";
import { toggleImovelAtivo } from "./actions";

export default function ToggleAtivoButton({
  id,
  ativo,
}: {
  id: string;
  ativo: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
  <button
    type="button"
    onClick={() => startTransition(() => toggleImovelAtivo(id))}
    disabled={isPending}
    className={[
      "inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-xs font-semibold border transition",
      ativo
        ? "bg-green-700 text-white border-green-700 hover:bg-green-800"
        : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50",
      isPending ? "opacity-60 cursor-not-allowed" : "",
    ].join(" ")}
    title={ativo ? "Ativo (aparece no site)" : "Inativo (não aparece no site)"}
  >
    <span
      className={[
        "h-4 w-8 rounded-full p-[2px] transition",
        ativo ? "bg-green-900" : "bg-neutral-300",
      ].join(" ")}
    >
      <span
        className={[
          "block h-3 w-3 rounded-full bg-white transition",
          ativo ? "translate-x-4" : "translate-x-0",
        ].join(" ")}
      />
    </span>

    {ativo ? "Ativo" : "Inativo"}
  </button>
  );
}