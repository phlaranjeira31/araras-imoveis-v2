"use client";

import {
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Check, ChevronDown } from "lucide-react";

type SelectOption = {
  value: string;
  label: string;
};

type StyledSelectProps = {
  name: string;
  defaultValue?: string;
  options: SelectOption[];
  icon?: ReactNode;
  ariaLabel: string;
};

export default function StyledSelect({
  name,
  defaultValue = "",
  options,
  icon,
  ariaLabel,
}: StyledSelectProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectedOption =
    options.find((option) => option.value === selectedValue) ?? options[0];

  function selectOption(value: string) {
    setSelectedValue(value);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Enviado normalmente pelo formulário GET */}
      <input type="hidden" name={name} value={selectedValue} />

      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={`
          flex h-11 w-full items-center gap-3 rounded-xl border bg-white px-3.5
          text-left text-sm font-medium text-slate-700 outline-none
          transition duration-200
          ${
            isOpen
              ? "border-[#7f9970] ring-4 ring-[#7f9970]/10"
              : "border-slate-200 hover:border-[#a4b498]"
          }
        `}
      >
        {icon ? (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#eef4ea] text-[#597548]">
            {icon}
          </span>
        ) : null}

        <span className="min-w-0 flex-1 truncate">
          {selectedOption?.label}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className="
            absolute left-0 right-0 top-[calc(100%+8px)] z-[150]
            max-h-64 overflow-y-auto rounded-2xl border border-slate-200
            bg-white p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.16)]
          "
        >
          {options.map((option) => {
            const isSelected = option.value === selectedValue;

            return (
              <button
                key={`${name}-${option.value || "all"}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => selectOption(option.value)}
                className={`
                  flex w-full items-center justify-between gap-3 rounded-xl
                  px-3 py-2.5 text-left text-sm transition
                  ${
                    isSelected
                      ? "bg-[#edf4e9] font-bold text-[#426238]"
                      : "text-slate-700 hover:bg-slate-50"
                  }
                `}
              >
                <span className="truncate">{option.label}</span>

                {isSelected ? (
                  <Check className="h-4 w-4 shrink-0 text-[#527443]" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}