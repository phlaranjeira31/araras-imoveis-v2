import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditImovelForm from "./EditImovelForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditarImovelPage({ params }: PageProps) {
  const { id } = await params;

  const imovel = await prisma.imovel.findUnique({
    where: { id },
  });

  if (!imovel) return notFound();

  return (
    <main className="px-6 py-10 max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Editar imóvel</h1>
          <p className="text-neutral-500">
            Atualize as informações principais do imóvel.
          </p>
        </div>

        <Link
          href="/admin/imoveis"
          className="px-4 py-2 rounded-xl border hover:bg-neutral-50"
        >
          Voltar
        </Link>
      </div>

      <EditImovelForm
        id={imovel.id}
        defaultValues={{
          title: imovel.title ?? "",
          slug: imovel.slug ?? "",
          city: imovel.city ?? "",
          neighborhood: imovel.neighborhood ?? "",
          cep: imovel.cep ?? "",
          tipo: (imovel as any).tipo ?? "",
          purpose: (imovel as any).purpose ?? "",
          price: typeof imovel.price === "number" ? String(imovel.price) : "",
          priceRent:
            typeof (imovel as any).priceRent === "number"
              ? String((imovel as any).priceRent)
              : "",
          descricao: (imovel as any).descricao ?? "",
          proprietarioNome: (imovel as any).proprietarioNome ?? "",
          proprietarioTelefone: (imovel as any).proprietarioTelefone ?? "",
          condominioNome: (imovel as any).condominioNome ?? "",
          codigo: (imovel as any).codigo ?? "",
          endereco: (imovel as any).endereco ?? "",
          corretoraCaptacao: (imovel as any).corretoraCaptacao ?? "",
          condominio: imovel.condominio?.toString() ?? "",
          iptu: imovel.iptu?.toString() ?? "",
          areaConstruida: (imovel as any).areaConstruida?.toString() ?? "",
          areaTerreno: (imovel as any).areaTerreno?.toString() ?? "",
        }}
      />
    </main>
  );
}