"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Photo = {
  id: string;
  url: string;
};

export default function ImovelPhotosGallery({
  photos,
  coverPhotoId,
}: {
  photos: Photo[];
  coverPhotoId: string | null;
}) {
  const urls = useMemo(() => photos.map((p) => p.url), [photos]);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const openAt = (idx: number) => {
    if (!urls.length) return;
    const safe = (idx + urls.length) % urls.length;
    setOpenIndex(safe);
  };

  const close = () => setOpenIndex(null);

  const next = () => {
    if (openIndex == null) return;
    openAt(openIndex + 1);
  };

  const prev = () => {
    if (openIndex == null) return;
    openAt(openIndex - 1);
  };

  // ESC fecha | setas do teclado navegam
  useEffect(() => {
    if (openIndex == null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  // trava scroll enquanto modal está aberto
  useEffect(() => {
    if (openIndex == null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex]);

  // Swipe (mobile)
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null || startY.current == null) return;

    const t = e.changedTouches[0];
    const dx = t.clientX - startX.current;
    const dy = t.clientY - startY.current;

    startX.current = null;
    startY.current = null;

    if (Math.abs(dx) < 60) return;
    if (Math.abs(dx) < Math.abs(dy)) return;

    if (dx < 0) next();
    else prev();
  };

  const currentUrl = openIndex == null ? null : urls[openIndex];

  // ✅ NOVO: limite para mostrar no grid + "Ver mais"
  const GRID_LIMIT = 7;
  const showMore = photos.length > GRID_LIMIT;
  const gridPhotos = showMore ? photos.slice(0, GRID_LIMIT) : photos;

  return (
    <>
      {/* GRID (agora com "+ Ver mais") */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {gridPhotos.map((p, idx) => {
          const isCover = coverPhotoId === p.id;

          // se tiver mais de 7, o último card vira "Ver mais"
          const isLastCard = showMore && idx === GRID_LIMIT - 1;

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => openAt(idx)}
              className={`relative overflow-hidden rounded-2xl border bg-white text-left ${
                isCover ? "ring-2 ring-primary" : ""
              }`}
              title={isCover ? "Capa" : "Abrir foto"}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={p.url}
                  alt="Foto do imóvel"
                  fill
                  className="object-cover"
                />
              </div>

              {isCover ? (
                <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                  Capa
                </span>
              ) : null}

              {isLastCard ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                  <span className="rounded-full bg-white/90 px-5 py-2 text-sm font-extrabold text-slate-900">
                    + Ver mais
                  </span>
                </div>
              ) : (
                <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[11px] font-semibold text-white">
                  Ampliar
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* MODAL tela cheia (mostra TODAS as fotos) */}
      {currentUrl && (
        <div
          className="fixed inset-0 z-[999] bg-black/90"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 p-3 sm:p-6 md:p-10"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Top bar */}
            <div className="absolute left-3 right-3 top-3 z-20 flex items-center justify-between sm:left-6 sm:right-6 sm:top-6 md:left-10 md:right-10 md:top-10">
              <div className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white">
                {openIndex! + 1} / {urls.length}
              </div>

              <button
                type="button"
                onClick={close}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
              >
                Fechar ✕
              </button>
            </div>

            {/* Setas */}
            {urls.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Foto anterior"
                  className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:left-6 md:left-10"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M15 18l-6-6 6-6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Próxima foto"
                  className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:right-6 md:right-10"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Imagem */}
            <div className="relative h-full w-full">
              <Image
                src={currentUrl}
                alt="Foto do imóvel em tela cheia"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Dica de swipe (só mobile) */}
            {urls.length > 1 && (
              <div className="pointer-events-none absolute bottom-4 left-0 right-0 z-20 text-center text-xs font-semibold text-white/70 sm:hidden">
                Arraste para o lado para mudar de foto
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}


