"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="px-3 py-2 rounded-xl border hover:bg-neutral-50 text-sm"
    >
      Imprimir
    </button>
  );
}
