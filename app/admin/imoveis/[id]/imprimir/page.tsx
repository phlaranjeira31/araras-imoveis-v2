import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

import AutoPrint from "./AutoPrint";
import PrintNowButton from "./PrintNowButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ id: string }>;
};

function money(value: number | null | undefined) {
  if (typeof value !== "number") return "—";

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function yesNo(value: boolean | null | undefined) {
  if (value === null || value === undefined) return "—";
  return value ? "Sim" : "Não";
}

function finalidade(value?: string | null) {
  switch (String(value || "").toLowerCase()) {
    case "comprar":
      return "Venda";
    case "alugar":
      return "Locação";
    case "temporada":
      return "Temporada";
    case "lancamentos":
      return "Lançamento";
    default:
      return value || "—";
  }
}

export default async function ImprimirImovelPage({
  params,
}: PageProps) {
  const { id } = await params;

  const imovel = await prisma.imovel.findUnique({
    where: { id },
    include: {
      photos: true,
    },
  });

  if (!imovel) {
    return notFound();
  }

  const cover =
    (imovel.coverPhotoId &&
      imovel.photos.find(
        (photo) => photo.id === imovel.coverPhotoId
      )?.url) ||
    imovel.photos[0]?.url ||
    "/placeholder.jpg";

  const valorPrincipal =
    String(imovel.purpose || "").toLowerCase() === "alugar"
      ? imovel.priceRent
      : imovel.price;

  const localizacao = [
    imovel.neighborhood,
    imovel.city,
  ]
    .filter(Boolean)
    .join(" • ");

  const endereco = [
    (imovel as any).endereco,
    imovel.neighborhood,
    imovel.city,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <main className="print-page bg-[#f4f6f4] px-4 py-8 sm:px-6">
      <AutoPrint />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @page {
              size: A4 portrait;
              margin: 5mm;
            }

            @media print {
              html,
              body {
                width: 210mm !important;
                height: 297mm !important;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
              }

              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              .no-print {
                display: none !important;
              }

              .print-page {
                width: 100% !important;
                min-height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
              }

              .print-sheet {
                width: 200mm !important;
                height: 286mm !important;
                max-height: 286mm !important;
                margin: 0 auto !important;
                padding: 6mm !important;
                border: 0 !important;
                border-radius: 0 !important;
                box-shadow: none !important;
                overflow: hidden !important;
                box-sizing: border-box !important;
                page-break-after: avoid !important;
                page-break-before: avoid !important;
                break-inside: avoid !important;
              }

              .print-cover {
                height: 72mm !important;
              }

              .print-info-grid {
                gap: 2mm !important;
              }

              .print-info-card {
                min-height: 12mm !important;
                padding: 2.2mm 2.6mm !important;
                break-inside: avoid !important;
              }

              .print-description {
                max-height: 29mm !important;
                overflow: hidden !important;
              }

              .print-description-text {
                display: -webkit-box !important;
                -webkit-box-orient: vertical !important;
                -webkit-line-clamp: 6 !important;
                overflow: hidden !important;
              }

              a {
                color: inherit !important;
                text-decoration: none !important;
              }
            }
          `,
        }}
      />

      {/* CONTROLES SOMENTE NA TELA */}
      <div className="no-print mx-auto mb-5 flex max-w-[900px] items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#668052]">
            Araras Imóveis
          </p>

          <h1 className="mt-1 text-xl font-bold text-slate-950">
            Prévia da ficha do imóvel
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            A ficha está configurada para impressão em uma folha A4.
          </p>
        </div>

        <PrintNowButton />
      </div>

      {/* FOLHA */}
      <article
        id="property-print-sheet"
        className="
          print-sheet
          mx-auto w-full max-w-[900px]
          overflow-hidden rounded-[28px]
          border border-[#dde5dc]
          bg-white
          p-6
          shadow-[0_20px_55px_rgba(20,40,28,0.10)]
        "
      >
        {/* CABEÇALHO */}
        <header className="flex items-center justify-between gap-5 border-b border-[#e8ede7] pb-4">
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-12 w-12 items-center justify-center
                rounded-2xl bg-[#365f4d]
                text-lg font-black text-white
              "
            >
              A
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#668052]">
                Araras Imóveis
              </p>

              <h2 className="mt-0.5 text-lg font-bold tracking-[-0.02em] text-slate-950">
                Ficha do imóvel
              </h2>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Código
            </p>

            <p className="mt-1 text-sm font-bold text-[#365f4d]">
              {(imovel as any).codigo || "—"}
            </p>
          </div>
        </header>

        {/* TÍTULO + PREÇO */}
        <section className="flex items-start justify-between gap-6 py-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className="
                  rounded-full bg-[#edf4e9]
                  px-3 py-1
                  text-[9px] font-bold uppercase
                  tracking-[0.12em] text-[#527443]
                "
              >
                {finalidade(imovel.purpose)}
              </span>

              {(imovel as any).tipo ? (
                <span
                  className="
                    rounded-full border border-slate-200
                    px-3 py-1 text-[9px]
                    font-semibold text-slate-500
                  "
                >
                  {(imovel as any).tipo}
                </span>
              ) : null}
            </div>

            <h1 className="max-w-[650px] text-[23px] font-extrabold leading-[1.12] tracking-[-0.035em] text-slate-950">
              {imovel.title}
            </h1>

            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 text-[#6e865c]"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="12"
                  cy="10"
                  r="2.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>

              {localizacao || "Localização não informada"}
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Valor
            </p>

            <p className="mt-1 text-[22px] font-extrabold tracking-[-0.035em] text-[#365f4d]">
              {money(valorPrincipal)}
            </p>

            {String(imovel.purpose || "").toLowerCase() ===
            "alugar" ? (
              <p className="mt-0.5 text-[9px] text-slate-400">
                valor mensal
              </p>
            ) : null}
          </div>
        </section>

        {/* FOTO */}
        <div
          className="
            print-cover
            relative h-[300px]
            overflow-hidden rounded-[20px]
            bg-slate-100
          "
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={imovel.title}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            {(imovel as any).quartos != null ? (
              <FeaturePill
                label={`${(imovel as any).quartos} ${
                  (imovel as any).quartos === 1
                    ? "quarto"
                    : "quartos"
                }`}
              />
            ) : null}

            {(imovel as any).suites != null ? (
              <FeaturePill
                label={`${(imovel as any).suites} ${
                  (imovel as any).suites === 1
                    ? "suíte"
                    : "suítes"
                }`}
              />
            ) : null}

            {(imovel as any).banheiros != null ? (
              <FeaturePill
                label={`${(imovel as any).banheiros} ${
                  (imovel as any).banheiros === 1
                    ? "banheiro"
                    : "banheiros"
                }`}
              />
            ) : null}

            {(imovel as any).areaConstruida != null ? (
              <FeaturePill
                label={`${(imovel as any).areaConstruida} m²`}
              />
            ) : null}
          </div>
        </div>

        {/* INFORMAÇÕES */}
        <section className="mt-4">
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#668052]">
                Informações
              </p>

              <h3 className="mt-0.5 text-sm font-bold text-slate-900">
                Características do imóvel
              </h3>
            </div>
          </div>

          <div className="print-info-grid grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Info
              label="Tipo"
              value={(imovel as any).tipo || "—"}
            />

            <Info
              label="Finalidade"
              value={finalidade(imovel.purpose)}
            />

            <Info
              label="Quartos"
              value={(imovel as any).quartos ?? "—"}
            />

            <Info
              label="Suítes"
              value={(imovel as any).suites ?? "—"}
            />

            <Info
              label="Banheiros"
              value={(imovel as any).banheiros ?? "—"}
            />

            <Info
              label="Vagas"
              value={(imovel as any).vagas ?? "—"}
            />

            <Info
              label="Área construída"
              value={
                (imovel as any).areaConstruida != null
                  ? `${(imovel as any).areaConstruida} m²`
                  : "—"
              }
            />

            <Info
              label="Área do terreno"
              value={
                (imovel as any).areaTerreno != null
                  ? `${(imovel as any).areaTerreno} m²`
                  : "—"
              }
            />

            <Info
              label="Mobiliado"
              value={yesNo((imovel as any).mobiliado)}
            />

            <Info
              label="Condomínio"
              value={money((imovel as any).condominio)}
            />

            <Info
              label="IPTU"
              value={money((imovel as any).iptu)}
            />

            <Info
              label="CEP"
              value={imovel.cep || "—"}
            />
          </div>
        </section>

        {/* LOCALIZAÇÃO / CONDOMÍNIO */}
        {(endereco ||
          (imovel as any).condominioNome) && (
          <section
            className="
              mt-3 grid grid-cols-1 gap-2
              border-t border-slate-100 pt-3
              sm:grid-cols-2
            "
          >
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Localização
              </p>

              <p className="mt-1 text-[11px] font-medium leading-4 text-slate-700">
                {endereco || "—"}
              </p>
            </div>

            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Condomínio
              </p>

              <p className="mt-1 text-[11px] font-medium leading-4 text-slate-700">
                {(imovel as any).condominioNome || "—"}
              </p>
            </div>
          </section>
        )}

        {/* DESCRIÇÃO */}
        <section className="print-description mt-3 border-t border-slate-100 pt-3">
          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#668052]">
            Descrição
          </p>

          <p
            className="
              print-description-text
              mt-1.5 whitespace-pre-line
              text-[10px] leading-[1.55]
              text-slate-600
            "
          >
            {(imovel as any).descricao ||
              "Nenhuma descrição cadastrada para este imóvel."}
          </p>
        </section>

        {/* RODAPÉ DA FICHA */}
        <footer
          className="
            mt-3 flex items-center justify-between
            gap-4 border-t border-[#e8ede7] pt-3
          "
        >
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#668052]">
              Araras Imóveis
            </p>

            <p className="mt-0.5 text-[9px] text-slate-400">
              Petrópolis • Itaipava • Araras e região
            </p>
          </div>

          <div className="text-right">
            <p className="text-[9px] font-semibold text-slate-500">
              ararasimoveis.net.br
            </p>
          </div>
        </footer>
      </article>
    </main>
  );
}

function FeaturePill({
  label,
}: {
  label: string;
}) {
  return (
    <span
      className="
        rounded-full border border-white/20
        bg-black/45 px-2.5 py-1
        text-[9px] font-semibold text-white
        backdrop-blur-sm
      "
    >
      {label}
    </span>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div
      className="
        print-info-card
        min-w-0 rounded-xl
        border border-[#e7ece5]
        bg-[#fbfcfa]
        px-3 py-2.5
      "
    >
      <p className="text-[8px] font-bold uppercase tracking-[0.11em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-[11px] font-bold text-slate-800">
        {String(value)}
      </p>
    </div>
  );
}