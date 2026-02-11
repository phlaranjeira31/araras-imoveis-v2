"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

type Props = {
  value: { lat: number | null; lng: number | null };
  onChange: (next: { lat: number; lng: number }) => void;
  height?: number;
  zoom?: number;
};

function ClickHandler({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapViewClient({
  value,
  onChange,
  height = 320,
  zoom = 13,
}: Props) {
  // fallback (Petrópolis) se ainda não tiver marcado
  const center: LatLngExpression = useMemo(() => {
    const lat = value.lat ?? -22.505;
    const lng = value.lng ?? -43.178;
    return [lat, lng];
  }, [value.lat, value.lng]);

  const [ready, setReady] = useState(false);

  // Ajuste de ícones do Leaflet (marker quebrado no Next)
  useEffect(() => {
    // garante que só roda no browser
    if (typeof window === "undefined") return;

    (async () => {
      const L = await import("leaflet");

      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      setReady(true);
    })();
  }, []);

  // evita render durante setup do leaflet no client
  if (!ready) {
    return (
      <div
        className="w-full rounded-2xl border bg-white"
        style={{ height }}
      />
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border bg-white">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        style={{ height, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickHandler
          onPick={(lat, lng) => {
            onChange({ lat, lng });
          }}
        />

        {value.lat != null && value.lng != null && (
          <Marker position={[value.lat, value.lng]} />
        )}
      </MapContainer>
    </div>
  );
}



