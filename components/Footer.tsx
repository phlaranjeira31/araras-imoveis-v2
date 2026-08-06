// components/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const PHONE_LIDIANE_DISPLAY = "21 96450-7343";
const PHONE_LIDIANE_TEL = "+5521964507343";

const PHONE_CLAUDIA_DISPLAY = "24 98823-0138";
const PHONE_CLAUDIA_TEL = "+5524988230138";

// Mantém o WhatsApp do footer direcionando para Lidiane,
// igual ao funcionamento atual do arquivo.
const WHATSAPP_TEL = PHONE_LIDIANE_TEL;

const EMAIL = "araras.imoveisrj@gmail.com";

const ADDRESS_DISPLAY =
  "Estrada União Industria, 9.500, Sala 03, Itaipava, Petrópolis - RJ";

const MAPS_URL = "https://maps.app.goo.gl/c4XBMaE3u8w2kZY2A";

const INSTAGRAM_URL =
  "https://www.instagram.com/araras.imoveis?igsh=bDNrMDk1dW80czZs";

const YOUTUBE_URL = "https://www.youtube.com/@araras.imoveis";

const REGIONS = [
  {
    label: "Centro",
    href: "/imoveis?bairro=Petrópolis",
  },
  {
    label: "Itaipava",
    href: "/imoveis?bairro=Itaipava",
  },
  {
    label: "Araras",
    href: "/imoveis?bairro=Araras",
  },
  {
    label: "Cascatinha",
    href: "/imoveis?bairro=Cascatinha",
  },
  {
    label: "Corrêas",
    href: "/imoveis?bairro=Corrêas",
  },
  {
    label: "Secretário",
    href: "/imoveis?bairro=Secretário",
  },
  {
    label: "Pedro do Rio",
    href: "/imoveis?bairro=Pedro%20do%20Rio",
  },
  {
    label: "Posse",
    href: "/imoveis?bairro=Posse",
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden bg-[#365f4d] text-white">
      {/* Elementos decorativos de fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#8ca780]/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-4 pt-7 sm:pt-8">
        {/* Conteúdo principal */}
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1fr_1fr] lg:gap-8">
          {/* Marca e endereço */}
          <div>
            <div className="relative h-20 w-44 sm:h-24 sm:w-52">
              <Image
                src="/brand/logo-footer.png"
                alt="Araras Imóveis"
                fill
                sizes="208px"
                className="object-contain object-left"
              />
            </div>

            <div className="mt-3 flex items-center gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">
                CRECI: 10376
              </span>

              <span className="h-px flex-1 bg-white/15" />
            </div>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
              Atendimento rápido e curadoria de imóveis de alto padrão em toda
              serra carioca.
            </p>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 flex items-start gap-3 rounded-xl border border-white/15 bg-black/10 p-3 transition hover:border-white/30 hover:bg-white/10"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <MapPin className="h-4 w-4 text-white" />
              </span>

              <span className="min-w-0">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60">
                  Nosso endereço
                  <ExternalLink className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>

                <span className="mt-1 block text-sm font-medium leading-5 text-white">
                  {ADDRESS_DISPLAY}
                </span>
              </span>
            </a>
          </div>

          {/* Atendimento */}
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
                Atendimento
              </h3>

              <span className="h-px flex-1 bg-white/15" />
            </div>

            <div className="mt-4 rounded-xl border border-white/15 bg-black/10 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Phone className="h-4 w-4 text-white" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Telefones
                  </p>

                  <div className="mt-2 space-y-2">
                    <a
                      href={`tel:${PHONE_LIDIANE_TEL}`}
                      className="group block rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 transition hover:border-white/25 hover:bg-white/10"
                    >
                      <span className="block text-xs text-white/60">
                        Lidiane Farias
                      </span>

                      <span className="mt-0.5 block text-sm font-bold text-white group-hover:underline group-hover:underline-offset-4">
                        {PHONE_LIDIANE_DISPLAY}
                      </span>
                    </a>

                    <a
                      href={`tel:${PHONE_CLAUDIA_TEL}`}
                      className="group block rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 transition hover:border-white/25 hover:bg-white/10"
                    >
                      <span className="block text-xs text-white/60">
                        Claudia Raposo
                      </span>

                      <span className="mt-0.5 block text-sm font-bold text-white group-hover:underline group-hover:underline-offset-4">
                        {PHONE_CLAUDIA_DISPLAY}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-start gap-3 rounded-xl border border-white/10 px-3 py-2 transition hover:border-white/25 hover:bg-white/[0.06]"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />

                <span className="min-w-0">
                  <span className="block text-xs text-white/60">E-mail</span>

                  <span className="block break-all text-sm font-semibold text-white">
                    {EMAIL}
                  </span>
                </span>
              </a>

              <div className="flex items-start gap-3 rounded-xl border border-white/10 px-3 py-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />

                <span>
                  <span className="block text-xs text-white/60">
                    Horário de atendimento
                  </span>

                  <span className="block text-sm font-semibold text-white">
                    Segunda a sábado • 9h às 18h
                  </span>
                </span>
              </div>
            </div>

            {/* Redes sociais */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${WHATSAPP_TEL.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Falar com a Araras Imóveis pelo WhatsApp"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                  className="fill-white"
                >
                  <path d="M20.52 3.48A11.86 11.86 0 0012.02 0C5.4 0 .02 5.38.02 12c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.62A11.93 11.93 0 0012.02 24C18.64 24 24 18.62 24 12c0-3.2-1.25-6.21-3.48-8.52zM12.02 22.02c-1.84 0-3.65-.5-5.23-1.44l-.38-.23-3.68.96.98-3.59-.25-.37A9.97 9.97 0 012 12C2 6.49 6.5 2 12.02 2c2.66 0 5.16 1.04 7.04 2.93A9.9 9.9 0 0122 12c0 5.52-4.49 10.02-9.98 10.02zm5.84-7.54c-.32-.16-1.88-.93-2.17-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.36.24-.68.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.36.48-.54.16-.18.21-.32.32-.54.11-.21.05-.41-.03-.57-.08-.16-.71-1.71-.98-2.34-.26-.63-.53-.54-.71-.55h-.61c-.21 0-.54.08-.82.41-.28.32-1.07 1.04-1.07 2.54s1.09 2.95 1.25 3.16c.16.21 2.14 3.26 5.18 4.57.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.88-.77 2.14-1.5.26-.73.26-1.36.18-1.5-.08-.14-.29-.23-.61-.39z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Araras Imóveis"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                  className="fill-white"
                >
                  <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm10.25 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube da Araras Imóveis"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                  className="fill-white"
                >
                  <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.8 4.6 12 4.6 12 4.6s-5.8 0-7.5.5A3 3 0 0 0 2.4 7.2 31.7 31.7 0 0 0 2 12a31.7 31.7 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.7.5 7.5.5 7.5.5s5.8 0 7.5-.5a3 3 0 0 0 2.1-2.1A31.7 31.7 0 0 0 22 12a31.7 31.7 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
                </svg>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_TEL.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg bg-white px-4 py-2 text-center text-sm font-bold text-[#365f4d] transition hover:bg-[#f5f8f3]"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>

          {/* Regiões */}
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
                Regiões
              </h3>

              <span className="h-px flex-1 bg-white/15" />
            </div>

            <p className="mt-4 text-sm leading-6 text-white/75">
              Encontre imóveis nas principais regiões de Petrópolis e da serra.
            </p>

            <ul className="mt-4 grid grid-cols-2 gap-2">
              {REGIONS.map((region) => (
                <li key={region.label}>
                  <Link
                    href={region.href}
                    className="group flex min-h-10 w-full items-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/10"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-white/65 transition group-hover:text-white" />

                    <span>{region.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/imoveis"
              className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/25 px-5 py-2 text-sm font-bold text-white transition hover:border-white/40 hover:bg-white/10"
            >
              Ver todos os imóveis
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/10 p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                Atendimento personalizado
              </p>

              <p className="mt-1.5 text-sm leading-5 text-white/80">
                Não encontrou o imóvel ideal? Entre em contato e conte para
                nossa equipe o que você procura.
              </p>
            </div>
          </div>
        </div>

        {/* Linha inferior */}
        <div className="mt-7 flex flex-col gap-3 border-t border-white/15 py-4 text-xs text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Araras Imóveis — Todos os direitos
            reservados.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/imoveis" className="transition hover:text-white">
              Imóveis
            </Link>

            <Link
              href="/politica-de-privacidade"
              className="transition hover:text-white"
            >
              Política de privacidade
            </Link>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition hover:text-white"
            >
              Como chegar
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}