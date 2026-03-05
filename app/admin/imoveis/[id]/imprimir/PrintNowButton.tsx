"use client";

export default function PrintNowButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-xl bg-green-700 px-4 py-2 text-white text-sm font-semibold hover:opacity-90"
    >
      Imprimir agora
    </button>
  );
}