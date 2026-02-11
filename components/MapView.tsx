"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

type Props = { lat: number; lng: number };

const markerIcon = "/leaflet/marker-icon.png";
const markerIcon2x = "/leaflet/marker-icon-2x.png";
const markerShadow = "/leaflet/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function MapView({ lat, lng }: Props) {
  return (
    <div className="rounded-2xl overflow-hidden border">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: 360, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} />
      </MapContainer>
    </div>
  );
}


