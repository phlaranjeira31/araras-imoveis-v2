"use client";

import "leaflet/dist/leaflet.css";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// ✅ (se você já tinha seus marcadores/coords, pode substituir aqui)
type Pin = {
  label: string;        // ex: "Itaipava"
  bairro: string;       // ex: "Itaipava"
  cidade: string;       // ex: "Petrópolis"
  lat: number;
  lng: number;
};

const PINS: Pin[] = [
  { label: "Centro", bairro: "Centro", cidade: "Petrópolis", lat: -22.5099, lng: -43.1774 },
  { label: "Itaipava", bairro: "Itaipava", cidade: "Petrópolis", lat: -22.3819, lng: -43.1356 },
  { label: "Araras", bairro: "Araras", cidade: "Petrópolis", lat: -22.4349, lng: -43.1232 },
  { label: "Cascatinha", bairro: "Cascatinha", cidade: "Petrópolis", lat: -22.5216, lng: -43.2053 },
  { label: "Corrêas", bairro: "Corrêas", cidade: "Petrópolis", lat: -22.4047, lng: -43.1732 },
  { label: "Secretário", bairro: "Secretário", cidade: "Petrópolis", lat: -22.3786, lng: -43.2705 },
  { label: "Pedro do Rio", bairro: "Pedro do Rio", cidade: "Petrópolis", lat: -22.3408, lng: -43.1825 },
  { label: "Posse", bairro: "Posse", cidade: "Petrópolis", lat: -22.3960, lng: -43.2062 },
];

// ✅ Ícone (evita marcador “quebrado”)
const icon = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function PetropolisRegioesMap() {
  const router = useRouter();

  const center = useMemo(() => {
    // centro aproximado de Petrópolis
    return [-22.5099, -43.1774] as [number, number];
  }, []);

 function goToImoveis(pin: Pin) {
  // Vai pelo filtro exato de bairro (esse você já tem certeza que funciona)
  router.push(`/imoveis?bairro=${encodeURIComponent(pin.bairro)}`);;
}

  return (
    <div className="h-full w-full">
      <MapContainer
  {...({
    center,
    zoom: 11,
    style: { height: "100%", width: "100%" },
    scrollWheelZoom: true,
  } as any)}
>
        <TileLayer
  {...({
    attribution: "&copy; OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  } as any)}
/>

        {PINS.map((p) => (
          <Marker
  {...({
    key: `${p.cidade}-${p.bairro}`,
    position: [p.lat, p.lng],
    icon,
    eventHandlers: {
      click: () => goToImoveis(p),
    },
  } as any)}
>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{p.label}</div>
                <div className="text-slate-600">
                  {p.bairro} • {p.cidade}
                </div>
                <button
                  type="button"
                  onClick={() => goToImoveis(p)}
                  className="mt-2 inline-flex rounded-lg bg-green-700 px-3 py-2 text-white text-xs font-semibold"
                >
                  Ver imóveis
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

