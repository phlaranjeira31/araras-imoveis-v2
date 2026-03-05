"use client";

import { useEffect } from "react";
import { useWhatsAppFloat } from "@/components/WhatsAppContext";

type Props = {
  phoneTel: string; // ex: "+5524999397343"
  title: string;
  city?: string | null;
  neighborhood?: string | null;
  priceText?: string; // ex: "R$ 3.300.000,00"
  url?: string; // link absoluto ou relativo (tanto faz)
};

export default function WhatsAppImovelBinder({
  phoneTel,
  title,
  city,
  neighborhood,
  priceText,
  url,
}: Props) {
  const { setConfig } = useWhatsAppFloat();

  useEffect(() => {
    const base = `https://wa.me/${phoneTel.replace("+", "")}`;

    const msgLines = [
      "Olá! Tenho interesse neste imóvel:",
      `• ${title}`,
      city || neighborhood ? `• Local: ${[neighborhood, city].filter(Boolean).join(" • ")}` : null,
      priceText ? `• Valor: ${priceText}` : null,
      url ? `• Link: ${url}` : null,
      "",
      "Podemos agendar uma visita?",
    ].filter(Boolean);

    const text = encodeURIComponent(msgLines.join("\n"));
    const href = `${base}?text=${text}`;

    setConfig({
      href,
      ariaLabel: "Tenho interesse neste imóvel (WhatsApp)",
    });

    return () => {
      // ao sair da página do imóvel, volta pro padrão
      setConfig(null);
    };
  }, [setConfig, phoneTel, title, city, neighborhood, priceText, url]);

  return null;
}