
"use client";

import { useWhatsAppFloat } from "@/components/WhatsAppContext";

const PHONE_TEL = "+5524999397343";

// padrão (site inteiro)
function defaultHref() {
  const base = `https://wa.me/${PHONE_TEL.replace("+", "")}`;
  const text = encodeURIComponent(
    "Olá! Vim pelo site Araras Imóveis. Quero falar com um corretor(a)."
  );
  return `${base}?text=${text}`;
}

export default function WhatsAppFloat() {
  const { config } = useWhatsAppFloat();

  const href = config?.href ?? defaultHref();
  const ariaLabel = config?.ariaLabel ?? "Falar no WhatsApp";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
      className="whatsapp-float"
    >
      {/* Mantém seu SVG do WhatsApp pra não mexer na identidade */}
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        aria-hidden="true"
        className="fill-white"
      >
        <path d="M20.52 3.48A11.86 11.86 0 0012.02 0C5.4 0 .02 5.38.02 12c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.62A11.93 11.93 0 0012.02 24C18.64 24 24 18.62 24 12c0-3.2-1.25-6.21-3.48-8.52zM12.02 22.02c-1.84 0-3.65-.5-5.23-1.44l-.38-.23-3.68.96.98-3.59-.25-.37A9.97 9.97 0 012 12C2 6.49 6.5 2 12.02 2c2.66 0 5.16 1.04 7.04 2.93A9.9 9.9 0 0122 12c0 5.52-4.49 10.02-9.98 10.02zm5.84-7.54c-.32-.16-1.88-.93-2.17-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.36.24-.68.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.36.48-.54.16-.18.21-.32.32-.54.11-.21.05-.41-.03-.57-.08-.16-.71-1.71-.98-2.34-.26-.63-.53-.54-.71-.55h-.61c-.21 0-.54.08-.82.41-.28.32-1.07 1.04-1.07 2.54s1.09 2.95 1.25 3.16c.16.21 2.14 3.26 5.18 4.57.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.88-.77 2.14-1.5.26-.73.26-1.36.18-1.5-.08-.14-.29-.23-.61-.39z" />
      </svg>
    </a>
  );
}