// components/Footer.tsx
import Link from "next/link";
import Image from "next/image"; // ✅ ADIÇÃO

const PHONE_DISPLAY = "(24) 99939-7343";
const PHONE_TEL = "+5524999397343";
const EMAIL = "araras.imoveisrj@gmail.com";

const ADDRESS_DISPLAY = "Estrada União Industria, 9.500, Itaipava, Petrópolis - RJ";
const MAPS_URL = "https://maps.app.goo.gl/c4XBMaE3u8w2kZY2A";

const INSTAGRAM_URL =
  "https://www.instagram.com/araras.imoveis?igsh=bDNrMDk1dW80czZs";
const YOUTUBE_URL = "https://www.youtube.com/@araras.imoveis";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#4a7c63] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Marca */}
          <div>
            {/* ✅ ADIÇÃO: Logo no footer (precisa estar com fundo transparente) */}
           
            <h3 className="text-lg font-extrabold tracking-wide">
              Araras Imóveis
            </h3>
            <p className="mt-1 text-sm text-white/80">CRECI: 10376</p>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/90">
              Atendimento rápido e curadoria de imóveis de alto padrão em toda Petrópolis.
            </p>

            <div className="mt-4">
              <p className="text-sm font-semibold text-white">Endereço:</p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-sm font-medium text-white underline underline-offset-4 hover:text-white/80"
              >
                {ADDRESS_DISPLAY}
              </a>
            </div>
            <div className="mt-6 relative h-28 w-56 sm:h-32 sm:w-64">
  <Image
    src="/brand/logo-footer.png"
    alt="Araras Imóveis"
    fill
    className="object-contain"
  />
</div>


          </div>

          {/* Contato */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Contato:
            </h3>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <span className="font-semibold text-white">Telefone:</span>{" "}
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="font-medium text-white underline underline-offset-4 hover:text-white/80"
                >
                  {PHONE_DISPLAY}
                </a>
              </div>

              <div>
                <span className="font-semibold text-white">E-mail:</span>{" "}
                <a
                  href={`mailto:${EMAIL}`}
                  className="font-medium text-white underline underline-offset-4 hover:text-white/80"
                >
                  {EMAIL}
                </a>
              </div>

              <div className="text-white/90">
                <span className="font-semibold text-white">Horário:</span>{" "}
                Seg–Sáb • 9h–18h
              </div>
            </div>

            {/* Ícones sociais */}
            <div className="mt-5 flex items-center gap-4">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${PHONE_TEL.replace("+", "")}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 transition hover:bg-white/15"
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
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 transition hover:bg-white/15"
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
                rel="noreferrer"
                aria-label="YouTube"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 transition hover:bg-white/15"
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
            </div>
          </div>

          {/* Regiões */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Regiões:
            </h3>

            {/* ✅ ADICIONADO: itens clicáveis + ícones */}
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
              <li>
                <Link
                  href="/imoveis?bairro=Petrópolis"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 transition hover:bg-white/15"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                    className="shrink-0 fill-white"
                  >
                    <path d="M3 19h18L14 7l-2.2 3.6L10 8 3 19Z" />
                  </svg>
                  Centro
                </Link>
              </li>

              <li>
                <Link
                  href="/imoveis?bairro=Itaipava"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 transition hover:bg-white/15"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                    className="shrink-0 fill-white"
                  >
                    <path d="M20 4c-7 0-12 4-13.7 9.3C4.7 17.7 7.8 21 12.2 21 18 21 21 15 21 8c0-1.4-.2-2.7-1-4ZM8.6 14.2c2-3.8 5.8-6.2 10-6.9-1 6.2-4.1 11.2-10.4 11.2-2.4 0-3.7-1.8-3.6-4.3Z" />
                  </svg>
                  Itaipava
                </Link>
              </li>

              <li>
                <Link
                  href="/imoveis?bairro=Araras"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 transition hover:bg-white/15"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                    className="shrink-0 fill-white"
                  >
                    <path d="M12 22c-2.2-2.8-3-5.2-3-7.4 0-.8.1-1.5.3-2.2-2.1.6-4.4.2-6.3-1.3 2.8-2.2 5.2-3 7.4-3 .8 0 1.5.1 2.2.3-.6-2.1-.2-4.4 1.3-6.3 2.2 2.8 3 5.2 3 7.4 0 .8-.1 1.5-.3 2.2 2.1-.6 4.4-.2 6.3 1.3-2.8 2.2-5.2 3-7.4 3-.8 0-1.5-.1-2.2-.3.6 2.1.2 4.4-1.3 6.3ZM12 10.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z" />
                  </svg>
                  Araras
                </Link>
              </li>

              <li>
                <Link
                  href="/imoveis?bairro=Cascatinha"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 transition hover:bg-white/15"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" className="shrink-0 fill-white">
                    <path d="M3 19h18L14 7l-2.2 3.6L10 8 3 19Z" />
                  </svg>
                  Cascatinha
                </Link>
              </li>

              <li>
                <Link
                  href="/imoveis?bairro=Corrêas"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 transition hover:bg-white/15"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" className="shrink-0 fill-white">
                    <path d="M20 4c-7 0-12 4-13.7 9.3C4.7 17.7 7.8 21 12.2 21 18 21 21 15 21 8c0-1.4-.2-2.7-1-4Z" />
                  </svg>
                  Corrêas
                </Link>
              </li>

              <li>
                <Link
                  href="/imoveis?bairro=Secretário"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 transition hover:bg-white/15"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" className="shrink-0 fill-white">
                    <path d="M12 22c-2.2-2.8-3-5.2-3-7.4 0-3.9 2.7-7.4 3-7.8.3.4 3 3.9 3 7.8 0 2.2-.8 4.6-3 7.4Z" />
                  </svg>
                  Secretário
                </Link>
              </li>

              <li>
                <Link
                  href="/imoveis?bairro=Pedro%20do%20Rio"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 transition hover:bg-white/15"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" className="shrink-0 fill-white">
                    <path d="M2 19h20l-10-7-10 7Zm10-9c1.7-1.7 3-3.4 3-5a3 3 0 1 0-6 0c0 1.6 1.3 3.3 3 5Z" />
                  </svg>
                  Pedro do Rio
                </Link>
              </li>

              <li>
                <Link
                  href="/imoveis?bairro=Posse"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 transition hover:bg-white/15"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" className="shrink-0 fill-white">
                    <path d="M12 2 2 7l10 5 10-5-10-5Zm0 7L2 4v10l10 5 10-5V4l-10 5Z" />
                  </svg>
                  Posse
                </Link>
              </li>
            </ul>

            <div className="mt-5">
              <Link
                href="/imoveis"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Ver Mais
              </Link>
            </div>
          </div>
        </div>

        {/* Linha inferior */}
        <div className="mt-8 border-t border-white/20 pt-4 text-center text-xs text-white/80">
          © {new Date().getFullYear()} Araras Imóveis — Todos os direitos
          reservados.
        </div>
      </div>
    </footer>
  );
}










