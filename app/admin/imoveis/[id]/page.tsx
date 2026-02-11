import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PhotosUploader from "./PhotosUploader";
import DeleteImovelButton from "./DeleteImovelButton";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminImovelFotosPage({ params }: PageProps) {
  const { id } = await params;

  const imovel = await prisma.imovel.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      city: true,
      neighborhood: true,
      slug: true,
      coverPhotoId: true,
      photos: {
        select: { id: true, url: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!imovel) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-xl font-semibold">Imóvel não encontrado</h1>
        <Link className="underline mt-4 inline-block" href="/admin/imoveis">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Fotos do imóvel</h1>
          <p className="text-sm text-gray-600 mt-1">
            {imovel.title} • {imovel.city} • {imovel.neighborhood}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/imovel/${imovel.slug}`}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white"
            target="_blank"
          >
            Ver página do imóvel
          </Link>

          <Link
            href="/admin/imoveis"
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Voltar
          </Link>

          {/* AGORA SIM: passa o ID REAL do imóvel para o botão */}
          <DeleteImovelButton imovelId={imovel.id} />
        </div>
      </div>

      <div className="mt-8 rounded-2xl border p-6">
        <h2 className="text-lg font-semibold">Adicionar fotos</h2>
        <p className="text-sm text-gray-600 mt-1">
          Envie as imagens e depois defina uma delas como capa.
        </p>

        <PhotosUploader
          imovelId={imovel.id}
          initialCoverPhotoId={imovel.coverPhotoId}
        />

        <div className="mt-10">
          <h2 className="text-lg font-semibold">Fotos cadastradas</h2>

          {imovel.photos.length === 0 ? (
            <p className="mt-2 text-sm text-gray-600">Nenhuma foto ainda.</p>
          ) : (
            <ul className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {imovel.photos.map((p) => (
                <li key={p.id} className="rounded-xl border overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt="Foto"
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-2 text-xs text-gray-600">
                    {imovel.coverPhotoId === p.id && (
                      <span className="rounded bg-green-100 px-2 py-1 text-green-700">
                        CAPA
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}










