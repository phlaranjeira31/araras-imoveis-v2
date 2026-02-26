"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

type Option = { label: string; value: string; disabled?: boolean };
type Group = { label: string; options: Option[] };

type Props = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options?: Option[];
  groups?: Group[];
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
};

export default function SelectMenu({
  label,
  placeholder = "Selecione...",
  value,
  onChange,
  options,
  groups,
  className = "",
  buttonClassName = "",
  menuClassName = "",
}: Props) {
  const id = useId();
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const flat = useMemo(() => {
    if (groups?.length) return groups.flatMap((g) => g.options);
    return options ?? [];
  }, [groups, options]);

  const selected = flat.find((o) => o.value === value)?.label ?? "";

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {label ? (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}

      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "flex w-full items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left",
          "shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200",
          buttonClassName,
        ].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`truncate ${selected ? "text-slate-900" : "text-slate-400"}`}>
          {selected || placeholder}
        </span>

        <svg
          className={`h-5 w-5 shrink-0 text-slate-500 transition ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open ? (
        <div
          className={[
            "absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl",
            "max-h-72 overflow-y-auto",
            menuClassName,
          ].join(" ")}
          role="listbox"
        >
          {groups?.length ? (
            <div className="py-2">
              {groups.map((g) => (
                <div key={g.label} className="px-2">
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {g.label}
                  </div>
                  <div className="mb-2 rounded-xl border border-slate-100">
                    {g.options.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        disabled={o.disabled}
                        onClick={() => {
                          onChange(o.value);
                          setOpen(false);
                        }}
                        className={[
                          "flex w-full items-center justify-between px-3 py-3 text-left",
                          "transition",
                          o.disabled ? "cursor-not-allowed text-slate-300" : "hover:bg-slate-50",
                          value === o.value ? "bg-slate-50 font-semibold text-slate-900" : "text-slate-700",
                        ].join(" ")}
                      >
                        <span className="truncate">{o.label}</span>
                        {value === o.value ? (
                          <span className="ml-3 text-slate-500">✓</span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-2">
              {(options ?? []).map((o) => (
                <button
                  key={o.value}
                  type="button"
                  disabled={o.disabled}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={[
                    "flex w-full items-center justify-between px-4 py-3 text-left",
                    "transition",
                    o.disabled ? "cursor-not-allowed text-slate-300" : "hover:bg-slate-50",
                    value === o.value ? "bg-slate-50 font-semibold text-slate-900" : "text-slate-700",
                  ].join(" ")}
                >
                  <span className="truncate">{o.label}</span>
                  {value === o.value ? <span className="ml-3 text-slate-500">✓</span> : null}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
