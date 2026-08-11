"use client";

export default function PrintNowButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="
        inline-flex h-11 items-center justify-center
        gap-2 rounded-xl bg-[#16863c]
        px-5 text-sm font-bold text-white
        shadow-sm transition
        hover:-translate-y-0.5 hover:bg-[#107533]
      "
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-4a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v4a2 2 0 0 1-2 2h-2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M7 14h10v7H7z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>

      Imprimir ficha
    </button>
  );
}