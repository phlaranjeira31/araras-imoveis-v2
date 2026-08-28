"use client";

import { useState } from "react";

type CurrencyInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: number | null;
};

function formatCurrency(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) return "";

  return Number(digits).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export default function CurrencyInput({
  name,
  label,
  placeholder = "R$ 0",
  defaultValue,
}: CurrencyInputProps) {
  const initial =
    typeof defaultValue === "number"
      ? String(defaultValue)
      : "";

  const [rawValue, setRawValue] =
    useState(initial);

  const [displayValue, setDisplayValue] =
    useState(formatCurrency(initial));

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const digits =
      event.target.value.replace(/\D/g, "");

    setRawValue(digits);
    setDisplayValue(
      formatCurrency(digits)
    );
  }

  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-semibold text-slate-600">
        {label}
      </span>

      <input
        type="hidden"
        name={name}
        value={rawValue}
      />

      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        className="h-11 w-full rounded-xl border border-slate-200 bg-[#fbfcfb] px-3 text-xs font-semibold text-slate-700 outline-none transition placeholder:font-normal placeholder:text-slate-300 focus:border-[#8da37d] focus:ring-4 focus:ring-[#6f895c]/10"
      />
    </label>
  );
}