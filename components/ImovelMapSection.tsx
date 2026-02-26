import MapViewClient from "./MapViewClient";

type Props = {
  lat: number | null;
  lng: number | null;
  cep?: string | null;
};

export default function ImovelMapSection({ lat, lng, cep }: Props) {
  const hasCoords = !!lat && !!lng;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">Localização</h2>

      <div className="mt-4">
        <MapViewClient
  value={hasCoords ? { lat: lat!, lng: lng! } : null}
  height={420}
  onChange={() => {}}
/>
      </div>

      <div className="mt-3 text-sm text-slate-600">
        {cep ? <>CEP: {cep} • </> : null}
        {hasCoords ? (
          <>
            lat: {lat!.toFixed(6)} • lng: {lng!.toFixed(6)}
          </>
        ) : (
          <>Localização não informada.</>
        )}
      </div>
    </section>
  );
}

