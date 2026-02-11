"use client";

import { useEffect } from "react";

type Props = {
  rootId?: string; // id do container com overflow-x
  prevSelector?: string;
  nextSelector?: string;
  autoplayMs?: number;
};

export default function HomeImoveisCarouselBehavior({
  rootId = "home-carousel",
  prevSelector = ".carousel-prev",
  nextSelector = ".carousel-next",
  autoplayMs = 4500,
}: Props) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;

    const prev = document.querySelector<HTMLButtonElement>(prevSelector);
    const next = document.querySelector<HTMLButtonElement>(nextSelector);

    // calcula um "step" baseado no primeiro card (pra não ficar chutando número)
    const getStep = () => {
      const firstCard = root.querySelector<HTMLElement>("a");
      if (!firstCard) return 420;
      const cardW = firstCard.getBoundingClientRect().width;
      // gap-4 = 16px
      return Math.round(cardW + 16);
    };

    const scrollByStep = (dir: -1 | 1) => {
      const step = getStep();
      root.scrollBy({ left: dir * step, behavior: "smooth" });
    };

    // --- Setas ---
    const onPrev = () => scrollByStep(-1);
    const onNext = () => scrollByStep(1);

    prev?.addEventListener("click", onPrev);
    next?.addEventListener("click", onNext);

    // --- Autoplay com pause inteligente ---
    let timer: number | null = null;
    let paused = false;

    const atEnd = () => {
      // tolerância pequena
      return root.scrollLeft + root.clientWidth >= root.scrollWidth - 8;
    };

    const tick = () => {
      if (paused) return;

      if (atEnd()) {
        // volta pro início
        root.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollByStep(1);
      }
    };

    const start = () => {
      stop();
      timer = window.setInterval(tick, autoplayMs);
    };

    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    const pause = () => {
      paused = true;
    };

    const resume = () => {
      paused = false;
    };

    // pausa quando o usuário interage (hover / touch / mouse)
    const onMouseEnter = () => pause();
    const onMouseLeave = () => resume();

    const onTouchStart = () => {
      pause();
      // volta a rodar depois de um tempinho
      window.setTimeout(() => resume(), 2500);
    };

    const onWheel = () => {
      pause();
      window.setTimeout(() => resume(), 1500);
    };

    root.addEventListener("mouseenter", onMouseEnter);
    root.addEventListener("mouseleave", onMouseLeave);
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("wheel", onWheel, { passive: true });

    // autoplay inicia
    start();

    return () => {
      prev?.removeEventListener("click", onPrev);
      next?.removeEventListener("click", onNext);

      root.removeEventListener("mouseenter", onMouseEnter);
      root.removeEventListener("mouseleave", onMouseLeave);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("wheel", onWheel);

      stop();
    };
  }, [rootId, prevSelector, nextSelector, autoplayMs]);

  return null;
}
