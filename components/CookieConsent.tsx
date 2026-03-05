"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "araras_cookie_consent_v1";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY);
    if (!accepted) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[999999] w-[94%] max-w-6xl -translate-x-1/2 px-3 sm:bottom-6 sm:px-4">
      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl bg-[#5f7d53] px-4 py-3 shadow-xl sm:flex-row sm:gap-4 sm:px-6 sm:py-4">
        <p className="text-[12.5px] leading-relaxed text-white/95 sm:text-sm">
          Ao prosseguir, você concorda com a nossa{" "}
          <Link
            href="/politica-de-privacidade"
            className="underline underline-offset-2 hover:text-white"
          >
            Política de Privacidade
          </Link>{" "}
          e com o uso dos cookies que nos permitem melhorar nossos serviços e
          recomendar conteúdos do seu interesse.
        </p>

        <button
          onClick={accept}
          className="whitespace-nowrap rounded-full bg-[#7f9c6e] px-5 py-2 text-[13px] font-semibold text-white transition hover:brightness-110 active:scale-[0.98] sm:px-6 sm:text-sm"
        >
          Ok, entendi
        </button>
      </div>
    </div>
  );
}