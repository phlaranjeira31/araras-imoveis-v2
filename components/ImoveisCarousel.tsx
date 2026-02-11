"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Imovel = {
  id: string;
  title: string;
  city?: string | null;
  neighborhood?: string | null;
  price?: number | null;
  slug: string;
  cover?: string; // já pronto (url da capa)
};

function formatBRL(v?: number | null) {
  if (typeof v !== "number") return "";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ImoveisCarousel({
  imoveis,
  autoPlayMs = 3500,
}: {
  imoveis: Imovel[];
  autoPlayMs?: number;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);

  // largura do “passo” (1 card por vez, respeitando gap)
  const step = useMemo(() => {
    // um chute seguro: 360px (seu card parece nessa faixa)
    return 360;
  }, []);

  function scrollByStep(dir: "left" | "right") {
    const el = scrollerRef.current;
    if (!el) return;

    const delta = dir === "left" ? -step : step;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }

  // Autoplay: rola sozinho e quando chega no fim, volta pro início
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (!autoPlayMs || paused) return;

    const id = window.setInterval(() => {
      if (!scrollerRef.current) return;
      const e = scrollerRef.current;

      const nearEnd =
        Math.ceil(e.scrollLeft + e.clientWidth) >= e.scrollWidth - 4;

      if (nearEnd) {
        e.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        e.scrollBy({ left: step, behavior: "smooth" });
      }
    }, autoPlayMs);

    return () => window.clearInterval(id);
  }, [autoPlayMs, paused, step]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* SETA ESQUERDA */}
      <button
        type="button"
        aria-label="Anterior"
        onClick={() => scrollByStep("left")}
        className="absolute left-[-10px] top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-md ring-1 ring-black/10 hover:bg-white"
      >
        ‹
      </button>

      {/* SETA DIREITA */}
      <button
        type="button"
        aria-label="Próximo"
        onClick={() => scrollByStep("right")}
        className="absolute right-[-10px] top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-md ring-1 ring-black/10 hover:bg-white"
      >
        ›
      </button>

      {/* LISTA HORIZONTAL */}
      <div
        ref={scrollerRef}
        className="
          flex gap-6 overflow-x-auto scroll-smooth
          snap-x snap-mandatory
          pb-2
          [-ms-overflow-style:none] [scrollbar-width:none]
        "
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* esconde scrollbar no Chrome */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {imoveis.map((imovel) => (
          <Link
            key={imovel.id}
            href={`/imovel/${imovel.slug}`}
            className="
              min-w-[280px] sm:min-w-[340px] md:min-w-[360px]
              snap-start
              block rounded-2xl border overflow-hidden bg-white
              hover:shadow-sm transition
            "
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imovel.cover || "/placeholder.jpg"}
              alt={imovel.title}
              className="h-56 w-full object-cover"
            />

            <div className="p-4 space-y-2">
              <p className="text-sm text-green-700 font-medium">
                {imovel.city || ""}
              </p>

              <h3 className="text-lg font-semibold leading-snug">
                {imovel.title}
              </h3>

              <p className="text-sm text-neutral-500">
                {[imovel.neighborhood, imovel.city].filter(Boolean).join(" • ")}
              </p>

              {typeof imovel.price === "number" && (
                <div className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                  {formatBRL(imovel.price)}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
