"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type WhatsAppFloatConfig = {
  href: string; // link completo do WhatsApp (wa.me com texto)
  ariaLabel?: string;
};

type Ctx = {
  config: WhatsAppFloatConfig | null;
  setConfig: (cfg: WhatsAppFloatConfig | null) => void;
};

const WhatsAppCtx = createContext<Ctx | null>(null);

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<WhatsAppFloatConfig | null>(null);

  const value = useMemo(() => ({ config, setConfig }), [config]);

  return <WhatsAppCtx.Provider value={value}>{children}</WhatsAppCtx.Provider>;
}

export function useWhatsAppFloat() {
  const ctx = useContext(WhatsAppCtx);
  if (!ctx) {
    throw new Error("useWhatsAppFloat must be used within WhatsAppProvider");
  }
  return ctx;
}