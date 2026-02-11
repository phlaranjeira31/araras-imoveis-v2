"use client";

import dynamic from "next/dynamic";

const PetropolisRegioesMap = dynamic(
  () => import("./PetropolisRegioesMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full grid place-items-center text-sm text-slate-500">
        Carregando mapa...
      </div>
    ),
  }
);

export default function PetropolisRegioesMapClient() {
  return (
    <div className="h-full w-full">
      <PetropolisRegioesMap />
    </div>
  );
}


