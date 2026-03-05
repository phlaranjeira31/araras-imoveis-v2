import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AutoPrint from "./AutoPrint";
import PrintNowButton from "./PrintNowButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ id: string }>;
};

function money(v: any) {
  if (typeof v !== "number") return "—";
  return `R$ ${v.toLocaleString("pt-BR")}`;
}

function yesNo(v: any) {
  if (v === null || v === undefined) return "—";
  return v ? "Sim" : "Não";
}

export default async function ImprimirImovelPage({ params }: PageProps) {
  const { id } = await params;

  const imovel = await prisma.imovel.findUnique({
    where: { id },
    include: { photos: true },
  });

  if (!imovel) return notFound();

  const cover =
    (imovel.coverPhotoId &&
      imovel.photos.find((p) => p.id === imovel.coverPhotoId)?.url) ||
    imovel.photos[0]?.url ||
    "/placeholder.jpg";

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      {/* imprime automaticamente quando abrir */}
      <AutoPrint />

      {/* estilos para impressão */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            .no-print { display: none !important; }
            body { background: white !important; }
            main { padding: 0 !important; }
          }
        `,
        }}
      />

      <div className="no-print mb-6 flex items-center justify-between gap-3">
  <h1 className="text-lg font-semibold">Prévia de impressão</h1>
  <PrintNowButton />
</div>

      <div className="rounded-2xl border bg-white p-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-extrabold">{imovel.title}</h2>

          <div className="text-sm text-neutral-600">
            {[imovel.neighborhood, imovel.city].filter(Boolean).join(" • ")}
          </div>

          <div className="text-xl font-bold">{money(imovel.price)}</div>

          {/* FOTO DE CAPA (somente) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={imovel.title}
            className="mt-4 w-full rounded-2xl border object-cover"
            style={{ maxHeight: 420 }}
          />

          {/* CARACTERÍSTICAS */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <Info label="Código" value={(imovel as any).codigo ?? "—"} />
            <Info label="Tipo" value={(imovel as any).tipo ?? "—"} />

            <Info label="Finalidade" value={(imovel as any).purpose ?? "—"} />
            <Info label="CEP" value={imovel.cep ?? "—"} />

            <Info label="Quartos" value={(imovel as any).quartos ?? "—"} />
            <Info label="Suítes" value={(imovel as any).suites ?? "—"} />

            <Info label="Banheiros" value={(imovel as any).banheiros ?? "—"} />
            <Info label="Vagas" value={(imovel as any).vagas ?? "—"} />

            <Info
              label="Área construída (m²)"
              value={(imovel as any).areaConstruida ?? "—"}
            />
            <Info
              label="Área do terreno (m²)"
              value={(imovel as any).areaTerreno ?? "—"}
            />

            <Info label="Mobiliado" value={yesNo((imovel as any).mobiliado)} />
            <Info label="Condomínio" value={money((imovel as any).condominio)} />

            <Info label="IPTU" value={money((imovel as any).iptu)} />
            <Info
              label="Nome do condomínio"
              value={(imovel as any).condominioNome ?? "—"}
            />
          </div>

          {/* DESCRIÇÃO */}
          <div className="mt-6">
            <div className="text-sm font-semibold text-neutral-800">Descrição</div>
            <div className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">
              {(imovel as any).descricao ?? "—"}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl border px-4 py-3">
      <div className="text-xs font-semibold text-neutral-500">{label}</div>
      <div className="mt-1 font-semibold text-neutral-900">{String(value)}</div>
    </div>
  );
}