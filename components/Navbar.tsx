"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation"; // ✅ ADIÇÃO

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // ✅ ADIÇÃO: detectar Home
  const pathname = usePathname();
  const isHome = pathname === "/";

  // ✅ ADIÇÃO: altura do navbar (pra não “subir” a página quando usar fixed)
  const headerRef = useRef<HTMLElement | null>(null);
  const [navHeight, setNavHeight] = useState(0);

  // Dropdowns (desktop)
  const [ddEmpresa, setDdEmpresa] = useState(false);
  const [ddServicos, setDdServicos] = useState(false);
  const [ddImoveis, setDdImoveis] = useState(false);

  const empresaRef = useRef<HTMLDivElement | null>(null);
  const servicosRef = useRef<HTMLDivElement | null>(null);
  const imoveisRef = useRef<HTMLDivElement | null>(null);

  function closeAllDropdowns() {
    setDdEmpresa(false);
    setDdServicos(false);
    setDdImoveis(false);
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;

      const inEmpresa = empresaRef.current?.contains(target);
      const inServicos = servicosRef.current?.contains(target);
      const inImoveis = imoveisRef.current?.contains(target);

      if (!inEmpresa && !inServicos && !inImoveis) {
        closeAllDropdowns();
      }
    }

    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") closeAllDropdowns();
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // ✅ ADIÇÃO: medir a altura real do navbar (só na Home)
  useEffect(() => {
    if (!isHome) return;

    const el = headerRef.current;
    if (!el) return;

    const update = () => {
      setNavHeight(el.getBoundingClientRect().height);
    };

    update();
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, [isHome]);

  return (
    <>
      <header
        ref={headerRef}
        // ✅ ADIÇÃO: na Home fica FIXED (acompanha sempre); fora da Home fica normal
        className={`border-b border-black/5 bg-white/80 backdrop-blur ${
          isHome ? "fixed top-0 left-0 right-0 z-50" : ""
        }`}
      >
        <div className="container-site flex items-center justify-between flex-wrap md:flex-nowrap gap-2 md:gap-0 py-2 md:py-0">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 md:gap-4 md:mr-10 lg:mr-16"
            onClick={() => {
              setOpen(false);
              closeAllDropdowns();
            }}
          >
            {/* ✅ AJUSTE: logo maior e “bonita” no mobile */}
            <div className="relative h-[56px] w-[190px] sm:h-16 sm:w-[220px] md:h-16 md:w-[220px] lg:h-24 lg:w-[420px]">
              <Image
                src="/brand/logo-navbar-nova.jpg"
                alt="Araras Imóveis"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 640px) 190px, (max-width: 768px) 220px, 420px"
              />
            </div>
          </Link>

          {/* Menu (DESKTOP) - agora com dropdowns */}
          <nav className="hidden md:flex items-center gap-6 text-[15px] font-medium text-slate-700">
            {/* EMPRESA */}
            <div ref={empresaRef} className="relative">
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-slate-950"
                aria-haspopup="menu"
                aria-expanded={ddEmpresa}
                onClick={() => {
                  setDdEmpresa((v) => !v);
                  setDdServicos(false);
                  setDdImoveis(false);
                }}
              >
                Empresa
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  aria-hidden="true"
                  className="opacity-70"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {ddEmpresa && (
                <div
                  role="menu"
                  className="absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg"
                >
                  <div className="p-2 grid gap-1 text-[13px] font-semibold text-slate-800">
                    <Link
                      href="/sobre"
                      className="rounded-xl px-3 py-2 hover:bg-slate-50"
                      onClick={() => closeAllDropdowns()}
                    >
                      Sobre Nós
                    </Link>

                    <Link
                      href="/mapa"
                      className="rounded-xl px-3 py-2 hover:bg-slate-50"
                      onClick={() => closeAllDropdowns()}
                    >
                      Mapa
                    </Link>

                    <Link
                      href="/#corretoras"
                      className="rounded-xl px-3 py-2 hover:bg-slate-50"
                      onClick={() => closeAllDropdowns()}
                    >
                      Nossas Corretoras
                    </Link>

                    <Link
                      href="/#contato"
                      className="rounded-xl px-3 py-2 hover:bg-slate-50"
                      onClick={() => closeAllDropdowns()}
                    >
                      Contato
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* SERVIÇOS */}
            <div ref={servicosRef} className="relative">
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-slate-950"
                aria-haspopup="menu"
                aria-expanded={ddServicos}
                onClick={() => {
                  setDdServicos((v) => !v);
                  setDdEmpresa(false);
                  setDdImoveis(false);
                }}
              >
                Serviços
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  aria-hidden="true"
                  className="opacity-70"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {ddServicos && (
                <div
                  role="menu"
                  className="absolute left-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg"
                >
                  <div className="p-2 grid gap-1 text-[13px] font-semibold text-slate-800">
                    <Link
                      href="/#contato"
                      className="rounded-xl px-3 py-2 hover:bg-slate-50"
                      onClick={() => closeAllDropdowns()}
                    >
                      Peça seu imóvel
                    </Link>

                    <Link
                      href="/#contato"
                      className="rounded-xl px-3 py-2 hover:bg-slate-50"
                      onClick={() => closeAllDropdowns()}
                    >
                      Anuncie seu imóvel
                    </Link>

                    <Link
                      href="/#contato"
                      className="rounded-xl px-3 py-2 hover:bg-slate-50"
                      onClick={() => closeAllDropdowns()}
                    >
                      Simule um Financiamento
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* IMÓVEIS */}
            <div ref={imoveisRef} className="relative">
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-slate-950"
                aria-haspopup="menu"
                aria-expanded={ddImoveis}
                onClick={() => {
                  setDdImoveis((v) => !v);
                  setDdEmpresa(false);
                  setDdServicos(false);
                }}
              >
                Imóveis
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  aria-hidden="true"
                  className="opacity-70"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {ddImoveis && (
                <div
                  role="menu"
                  className="absolute left-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg"
                >
                  <div className="p-2 grid gap-1 text-[13px] font-semibold text-slate-800">
                    <Link
                      href="/imoveis?purpose=comprar"
                      className="rounded-xl px-3 py-2 hover:bg-slate-50"
                      onClick={() => closeAllDropdowns()}
                    >
                      Comprar
                    </Link>

                    <Link
                      href="/imoveis?purpose=alugar"
                      className="rounded-xl px-3 py-2 hover:bg-slate-50"
                      onClick={() => closeAllDropdowns()}
                    >
                      Alugar
                    </Link>

                    <Link
                      href="/imoveis?purpose=todos"
                      className="rounded-xl px-3 py-2 hover:bg-slate-50"
                      onClick={() => closeAllDropdowns()}
                    >
                      Todos
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Ações */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
            <button
              type="button"
              className="md:hidden inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-semibold text-slate-900 hover:bg-slate-50"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Abrir menu"
            >
              {open ? "Fechar" : "Menu"}
            </button>

            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-semibold text-slate-900 hover:bg-slate-50"
            >
              Login
            </Link>

            {/* WhatsApp */}
            {/* WhatsApp (ícone premium) */}
            <a
  href="https://wa.me/5524988230138?text=Olá!%20Vim%20pelo%20site%20Araras%20Imóveis%20👋"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Falar no WhatsApp"
  className="
    flex items-center justify-center
    h-11 w-11
    rounded-full
    bg-green-600
    text-white
    shadow-md
    transition
    hover:bg-green-700
    hover:scale-105
  "
>
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                className="fill-white"
                aria-hidden="true"
              >
                <path d="M20.52 3.48A11.86 11.86 0 0012.02 0C5.4 0 .02 5.38.02 12c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.62A11.93 11.93 0 0012.02 24C18.64 24 24 18.62 24 12c0-3.2-1.25-6.21-3.48-8.52zM12.02 22.02c-1.84 0-3.65-.5-5.23-1.44l-.38-.23-3.68.96.98-3.59-.25-.37A9.97 9.97 0 012 12C2 6.49 6.5 2 12.02 2c2.66 0 5.16 1.04 7.04 2.93A9.9 9.9 0 0122 12c0 5.52-4.49 10.02-9.98 10.02zm5.84-7.54c-.32-.16-1.88-.93-2.17-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.36.24-.68.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.36.48-.54.16-.18.21-.32.32-.54.11-.21.05-.41-.03-.57-.08-.16-.71-1.71-.98-2.34-.26-.63-.53-.54-.71-.55h-.61c-.21 0-.54.08-.82.41-.28.32-1.07 1.04-1.07 2.54s1.09 2.95 1.25 3.16c.16.21 2.14 3.26 5.18 4.57.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.88-.77 2.14-1.5.26-.73.26-1.36.18-1.5-.08-.14-.29-.23-.61-.39z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Dropdown mobile */}
        {open && (
          <div className="md:hidden border-t border-black/5 bg-white/90 backdrop-blur">
            <div className="container-site py-3">
              <div className="grid gap-2 text-[13px] font-semibold text-slate-800">
                {/* Empresa */}
<div className="rounded-2xl border border-black/10 bg-white">
  <div className="px-3 py-2 text-[12px] text-slate-500">Empresa</div>
  <div className="grid gap-1 p-2 pt-0">
    <Link
      href="/sobre"
      className="rounded-xl px-3 py-2 hover:bg-slate-50"
      onClick={() => setOpen(false)}
    >
      Sobre Nós
    </Link>

    <Link
      href="/mapa"
      className="rounded-xl px-3 py-2 hover:bg-slate-50"
      onClick={() => setOpen(false)}
    >
      Mapa
    </Link>

    <Link
      href="/#corretoras"
      className="rounded-xl px-3 py-2 hover:bg-slate-50"
      onClick={() => setOpen(false)}
    >
      Nossas Corretoras
    </Link>

    <Link
      href="/#contato"
      className="rounded-xl px-3 py-2 hover:bg-slate-50"
      onClick={() => setOpen(false)}
    >
      Contato
    </Link>
  </div>
</div>


                {/* Serviços */}
                <div className="rounded-2xl border border-black/10 bg-white">
                  <div className="px-3 py-2 text-[12px] text-slate-500">Serviços</div>
                  <div className="grid gap-1 p-2 pt-0">
                    <Link
                      href="/#contato"
                      className="rounded-xl px-3 py-2 hover:bg-slate-50"
                      onClick={() => setOpen(false)}
                    >
                      Peça seu imóvel
                    </Link>

                    <Link
                      href="/#contato"
                      className="rounded-xl px-3 py-2 hover:bg-slate-50"
                      onClick={() => setOpen(false)}
                    >
                      Anuncie seu imóvel
                    </Link>

                    <Link
                      href="/#contato"
                      className="rounded-xl px-3 py-2 hover:bg-slate-50"
                      onClick={() => setOpen(false)}
                    >
                      Simule um Financiamento
                    </Link>
                  </div>
                </div>

                {/* Imóveis */}
                <div className="rounded-2xl border border-black/10 bg-white">
                  <div className="px-3 py-2 text-[12px] text-slate-500">Imóveis</div>
                  <div className="grid gap-1 p-2 pt-0">
                    <Link
                      href="/imoveis?purpose=comprar"
                      className="rounded-xl px-3 py-2 hover:bg-slate-50"
                      onClick={() => setOpen(false)}
                    >
                      Comprar
                    </Link>
                    <Link
                      href="/imoveis?purpose=alugar"
                      className="rounded-xl px-3 py-2 hover:bg-slate-50"
                      onClick={() => setOpen(false)}
                    >
                      Alugar
                    </Link>
                    <Link
                      href="/imoveis?purpose=todos"
                      className="rounded-xl px-3 py-2 hover:bg-slate-50"
                      onClick={() => setOpen(false)}
                    >
                      Todos
                    </Link>
                  </div>
                </div>

                <Link
                  href="/admin"
                  className="mt-1 rounded-xl border border-black/10 bg-white px-3 py-2 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ✅ ADIÇÃO: Espaçador só na Home (mesma altura do navbar) */}
      {isHome && <div style={{ height: navHeight }} />}
    </>
  );
}























