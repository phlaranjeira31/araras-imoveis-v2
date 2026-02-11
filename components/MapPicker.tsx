"use client";

import MapViewClient from "./MapViewClient";

type Props = {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
};

export default function MapPicker({ lat, lng, onChange }: Props) {
  return (
    <MapViewClient
      value={{ lat, lng }}
      onChange={(next) => onChange(next.lat, next.lng)}
      height={320}
      zoom={13}
    />
  );
}




