import Link from "next/link";
import { formatBRL } from "@/lib/format";

type Photo = { id: string; url: string };

type Props = {
  id: string;
  title: string;
  city: string;
  neighborhood: string;
  slug: string;
  price?: number | null;
  coverPhotoId?: string | null;
  photos?: Photo[];
};

export default function PropertyCard({
  title,
  city,
  neighborhood,
  slug,
  price,
  coverPhotoId,
  photos = [],
}: Props) {
  const cover = coverPhotoId
    ? photos.find((p) => p.id === coverPhotoId)?.url
    : photos[0]?.url;

  const imageUrl = cover || "/placeholder.jpg";

  return (
    <Link
      href={`/imovel/${slug}`}
      className="block rounded-2xl border overflow-hidden hover:shadow-sm transition"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt={title} className="h-56 w-full object-cover" />

      <div className="p-4 space-y-2">
        <p className="text-sm text-green-700 font-medium">{city}</p>

        <h3 className="text-lg font-semibold leading-snug">{title}</h3>

        <p className="text-sm text-neutral-500">
          {neighborhood} • {city}
        </p>

        {typeof price === "number" && (
          <div className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
            {formatBRL(price)}
          </div>
        )}
      </div>
    </Link>
  );
}


