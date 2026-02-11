"use client";

import { useState } from "react";

type Props = {
  title: string;
  text?: string;
};

export default function ShareImovelButton({ title, text }: Props) {
  const [loading, setLoading] = useState(false);

  async function copyFallback(link: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
        alert("Link copiado ✅");
        return;
      }
    } catch {}

    const input = document.createElement("input");
    input.value = link;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    alert("Link copiado ✅");
  }

  async function handleShare() {
    const url = window.location.href; // URL completa

    setLoading(true);
    try {
      // ✅ se o celular suportar, abre o MENU NATIVO (WhatsApp, Email, etc.)
      if (navigator.share) {
        await navigator.share({
          title,
          text: text ?? title,
          url,
        });
        return;
      }

      // ❌ se não suportar, copia o link
      await copyFallback(url);
    } catch (err: any) {
      if (err?.name === "AbortError") return; // usuário cancelou
      await copyFallback(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M15 8a3 3 0 1 0-2.83-4H12a3 3 0 0 0 .17 1L8.91 9.7A3 3 0 0 0 7 9a3 3 0 1 0 3 3c0-.35-.07-.69-.18-1l6.26-3.73A3 3 0 0 0 15 8Zm0-4a1 1 0 1 1-1 1 1 1 0 0 1 1-1ZM7 13a1 1 0 1 1 1-1 1 1 0 0 1-1 1Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Compartilhar
    </button>
  );
}




