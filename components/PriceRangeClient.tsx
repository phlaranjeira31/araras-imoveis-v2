"use client";

import { useMemo, useRef, useState } from "react";

type Props = {
  nameMin: string;
  nameMax: string;
  defaultMin?: number;
  defaultMax?: number;
  minBound?: number;
  maxBound?: number;
  step?: number;
};

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export default function PriceRangeClient({
  nameMin,
  nameMax,
  defaultMin,
  defaultMax,
  minBound = 0,
  maxBound = 25000000,
  step = 50000,
}: Props) {
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(v, b));

  const [minV, setMinV] = useState(() =>
    clamp(typeof defaultMin === "number" ? defaultMin : minBound, minBound, maxBound - step)
  );

  const [maxV, setMaxV] = useState(() =>
    clamp(typeof defaultMax === "number" ? defaultMax : maxBound, minBound + step, maxBound)
  );

  
  const [active, setActive] = useState<"min" | "max">("max");

  const wrapRef = useRef<HTMLDivElement | null>(null);

  const range = Math.max(1, maxBound - minBound);

  const leftPct = useMemo(() => ((minV - minBound) / range) * 100, [minV, minBound, range]);
  const rightPct = useMemo(() => ((maxV - minBound) / range) * 100, [maxV, minBound, range]);
  const widthPct = useMemo(() => Math.max(0, rightPct - leftPct), [leftPct, rightPct]);

  
  function onMinChange(v: number) {
    const next = clamp(v, minBound, maxV - step);
    setMinV(next);
  }

  function onMaxChange(v: number) {
    const next = clamp(v, minV + step, maxBound);
    setMaxV(next);
  }

  
  function valueFromClientX(clientX: number) {
    const el = wrapRef.current;
    if (!el) return minBound;
    const rect = el.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    const ratio = rect.width ? x / rect.width : 0;
    const raw = minBound + ratio * range;
    return Math.round(raw / step) * step;
  }

  function onTrackPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);

    const v = valueFromClientX(e.clientX);
    const distMin = Math.abs(v - minV);
    const distMax = Math.abs(v - maxV);

    if (distMin <= distMax) {
      setActive("min");
      onMinChange(v);
    } else {
      setActive("max");
      onMaxChange(v);
    }
  }

  const baseInput =
    "absolute inset-0 w-full bg-transparent appearance-none touch-none select-none " +
    "[&::-webkit-slider-runnable-track]:h-10 [&::-webkit-slider-runnable-track]:bg-transparent " +
    "[&::-moz-range-track]:h-10 [&::-moz-range-track]:bg-transparent " +
    
    "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 " +
    "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-600 [&::-webkit-slider-thumb]:shadow " +
    "[&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white " +
    "[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full " +
    "[&::-moz-range-thumb]:bg-slate-600 [&::-moz-range-thumb]:border-0";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
        <span>{formatBRL(minV)}</span>
        <span className="text-slate-400">até</span>
        <span>{formatBRL(maxV)}</span>
      </div>

      
      <input type="hidden" name={nameMin} value={String(minV)} />
      <input type="hidden" name={nameMax} value={String(maxV)} />

      <div
        ref={wrapRef}
        className="relative h-10"
        onPointerDown={onTrackPointerDown}
      >
        
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-200">
          <div
            className="h-1 rounded-full bg-green-700"
            style={{ marginLeft: `${leftPct}%`, width: `${widthPct}%` }}
          />
        </div>
        <input
          type="range"
          min={minV + step}
          max={maxBound}
          step={step}
          value={maxV}
          onPointerDown={(e) => {
            setActive("max");
            e.stopPropagation();
          }}
          onChange={(e) => onMaxChange(Number(e.target.value))}
          className={`${baseInput} ${active === "max" ? "z-40" : "z-30"}`}
          aria-label="Preço máximo"
        />
      </div>
    </div>
  );
}





