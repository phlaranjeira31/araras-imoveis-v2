"use client";

import { useEffect, useState } from "react";

type Photo = { id: string; url: string };

export default function PhotosUploader({
  imovelId,
  initialCoverPhotoId,
}: {
  imovelId: string;
  initialCoverPhotoId: string | null;
}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [coverPhotoId, setCoverPhotoId] = useState<string | null>(
    initialCoverPhotoId || null
  );

  async function load() {
    const res = await fetch(`/api/imoveis/${imovelId}/photos`, { cache: "no-store" });
    const data = await res.json();
    setPhotos(data.photos || []);
    setCoverPhotoId(data.coverPhotoId ?? coverPhotoId ?? null);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);

        const res = await fetch(`/api/imoveis/${imovelId}/photos/upload`, {
          method: "POST",
          body: form,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert(err?.error || "Erro ao fazer upload.");
          break;
        }
      }

      await load();
    } finally {
      setLoading(false);
    }
  }

  async function remove(photoId: string) {
    const res = await fetch(`/api/imoveis/${imovelId}/photos`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoId }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err?.error || "Erro ao remover.");
      return;
    }

    await load();
  }

  async function setCover(photoId: string | null) {
    const res = await fetch(`/api/imoveis/${imovelId}/photos/cover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoId }), // pode ser null para remover capa
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err?.error || "Falha ao definir capa");
      return;
    }

    setCoverPhotoId(photoId);
    await load();
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
          disabled={loading}
        />
        <span className="text-sm text-neutral-500">
          {loading ? "Enviando..." : "As fotos são enviadas automaticamente após selecionar."}
        </span>
      </div>

      {photos.length === 0 ? (
        <p className="text-sm text-gray-600">Nenhuma foto ainda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((p) => {
            const isCover = coverPhotoId === p.id;

            return (
              <div
                key={p.id}
                className={`rounded-xl border p-2 ${isCover ? "border-green-700" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt="Foto do imóvel"
                  className="h-32 w-full object-cover rounded-lg"
                />

                <div className="mt-2 space-y-2">
                  {isCover ? (
                    <button
                      type="button"
                      disabled
                      className="w-full rounded-lg bg-green-700 text-white px-3 py-2 opacity-90"
                    >
                      ✅ Capa
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCover(p.id)}
                      className="w-full rounded-lg border px-3 py-2 hover:bg-neutral-50"
                    >
                      Definir como capa
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="w-full rounded-lg border px-3 py-2 hover:bg-neutral-50"
                  >
                    Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {coverPhotoId && (
        <button
          type="button"
          onClick={() => setCover(null)}
          className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50"
        >
          Remover capa
        </button>
      )}
    </div>
  );
}






