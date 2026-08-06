"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Calculator,
  ChevronDown,
  CircleUserRound,
  Home,
  HousePlus,
  Info,
  KeyRound,
  MapPin,
  MapPinned,
  Menu,
  MessageCircle,
  Search,
  UsersRound,
  X,
} from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/5524988230138?text=Olá!%20Vim%20pelo%20site%20Araras%20Imóveis%20👋";

const EMPRESA_ITEMS = [
  {
    label: "Sobre Nós",
    description: "Conheça a Araras Imóveis.",
    href: "/sobre",
    icon: Info,
  },
  {
    label: "Mapa",
    description: "Veja nossa região de atuação.",
    href: "/mapa",
    icon: MapPinned,
  },
  {
    label: "Nossas Corretoras",
    description: "Conheça nossa equipe.",
    href: "/#corretoras",
    icon: UsersRound,
  },
  {
    label: "Contato",
    description: "Fale diretamente conosco.",
    href: "/#contato",
    icon: MessageCircle,
  },
];

const SERVICOS_ITEMS = [
  {
    label: "Peça seu imóvel",
    description: "Conte o que você está procurando.",
    href: "/#contato",
    icon: Search,
  },
  {
    label: "Anuncie seu imóvel",
    description: "Apresente seu imóvel à nossa equipe.",
    href: "/#contato",
    icon: HousePlus,
  },
  {
    label: "Simule um financiamento",
    description: "Receba orientação para financiar.",
    href: "/#contato",
    icon: Calculator,
  },
];

const IMOVEIS_ITEMS = [
  {
    label: "Comprar",
    description: "Imóveis disponíveis para venda.",
    href: "/imoveis?purpose=comprar",
    icon: Home,
  },
  {
    label: "Alugar",
    description: "Imóveis disponíveis para locação.",
    href: "/imoveis?purpose=alugar",
    icon: KeyRound,
  },
  {
    label: "Todos os imóveis",
    description: "Conheça nosso catálogo completo.",
    href: "/imoveis?purpose=todos",
    icon: Building2,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navHeight, setNavHeight] = useState(0);

  const [ddEmpresa, setDdEmpresa] = useState(false);
  const [ddServicos, setDdServicos] = useState(false);
  const [ddImoveis, setDdImoveis] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  const empresaRef = useRef<HTMLDivElement | null>(null);
  const servicosRef = useRef<HTMLDivElement | null>(null);
  const imoveisRef = useRef<HTMLDivElement | null>(null);

  const empresaActive =
    pathname === "/sobre" ||
    pathname === "/mapa";

  const imoveisActive =
    pathname === "/imoveis" ||
    pathname.startsWith("/imovel/");

  function closeAllDropdowns() {
    setDdEmpresa(false);
    setDdServicos(false);
    setDdImoveis(false);
  }

  function closeEverything() {
    setOpen(false);
    closeAllDropdowns();
  }

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      const target = event.target as Node;

      const insideEmpresa = empresaRef.current?.contains(target);
      const insideServicos = servicosRef.current?.contains(target);
      const insideImoveis = imoveisRef.current?.contains(target);
      const insideHeader = headerRef.current?.contains(target);

      if (!insideEmpresa && !insideServicos && !insideImoveis) {
        closeAllDropdowns();
      }

      if (!insideHeader) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeEverything();
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    function updateScroll() {
      setScrolled(window.scrollY > 12);
    }

    updateScroll();

    window.addEventListener("scroll", updateScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  useEffect(() => {
    if (!isHome) return;

    const element = barRef.current;

    if (!element) return;

    function updateHeight() {
      setNavHeight(element.getBoundingClientRect().height);
    }

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isHome]);

  useEffect(() => {
    setOpen(false);
    setDdEmpresa(false);
    setDdServicos(false);
    setDdImoveis(false);
  }, [pathname]);

  return (
    <>
      <header
        ref={headerRef}
        className={`
          z-[100] overflow-visible border-b transition-all duration-300
          ${
            isHome
              ? "fixed inset-x-0 top-0"
              : "sticky top-0"
          }
          ${
            scrolled
              ? "border-slate-200/80 bg-white/95 shadow-[0_12px_35px_rgba(15,23,42,0.09)] backdrop-blur-xl"
              : "border-black/5 bg-white/95 backdrop-blur-lg"
          }
        `}
      >
        {/* Linha superior decorativa */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#365f4d] via-[#73905f] to-[#365f4d]" />

        {/* Barra principal */}
        <div
          ref={barRef}
          className="
            mx-auto flex min-h-[78px] w-full max-w-6xl
            items-center justify-between gap-3
            px-4 pb-2 pt-[11px]
            lg:min-h-[86px]
          "
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="Ir para a página inicial da Araras Imóveis"
            className="group flex shrink-0 items-center"
            onClick={closeEverything}
          >
            <div className="relative h-[58px] w-[166px] sm:w-[180px] lg:h-[68px] lg:w-[210px]">
              <Image
                src="/brand/logo-navbar-nova.jpg"
                alt="Araras Imóveis"
                fill
                priority
                className="object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 166px, (max-width: 1024px) 180px, 210px"
              />
            </div>
          </Link>

          {/* Menu desktop */}
          <nav
            aria-label="Navegação principal"
            className="
              hidden items-center gap-1 rounded-full
              border border-slate-200/80 bg-slate-50/80 p-1.5
              shadow-inner shadow-white
              md:flex
            "
          >
            {/* Empresa */}
            <div ref={empresaRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={ddEmpresa}
                onClick={() => {
                  setDdEmpresa((current) => !current);
                  setDdServicos(false);
                  setDdImoveis(false);
                }}
                className={`
                  inline-flex h-10 items-center gap-1.5 rounded-full
                  px-4 text-sm font-semibold transition
                  ${
                    ddEmpresa || empresaActive
                      ? "bg-white text-[#365f4d] shadow-sm"
                      : "text-slate-700 hover:bg-white hover:text-[#365f4d]"
                  }
                `}
              >
                Empresa

                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    ddEmpresa ? "rotate-180" : ""
                  }`}
                />
              </button>

              {ddEmpresa && (
                <div
                  role="menu"
                  className="
                    absolute left-1/2 top-[calc(100%+14px)]
                    z-[130] w-[310px] -translate-x-1/2
                    rounded-3xl border border-slate-200
                    bg-white p-2
                    shadow-[0_22px_60px_rgba(15,23,42,0.18)]
                  "
                >
                  <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-slate-200 bg-white" />

                  <div className="relative">
                    <div className="px-3 pb-2 pt-2">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#71845e]">
                        Araras Imóveis
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Conheça nossa empresa e nossa região.
                      </p>
                    </div>

                    <div className="grid gap-1">
                      {EMPRESA_ITEMS.map((item) => {
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            role="menuitem"
                            onClick={closeEverything}
                            className="
                              group flex items-center gap-3 rounded-2xl
                              px-3 py-3 transition
                              hover:bg-[#f2f6ef]
                            "
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf3e9] text-[#527043]">
                              <Icon className="h-4.5 w-4.5" />
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-bold text-slate-800">
                                {item.label}
                              </span>

                              <span className="mt-0.5 block text-xs leading-4 text-slate-500">
                                {item.description}
                              </span>
                            </span>

                            <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#527043]" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Serviços */}
            <div ref={servicosRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={ddServicos}
                onClick={() => {
                  setDdServicos((current) => !current);
                  setDdEmpresa(false);
                  setDdImoveis(false);
                }}
                className={`
                  inline-flex h-10 items-center gap-1.5 rounded-full
                  px-4 text-sm font-semibold transition
                  ${
                    ddServicos
                      ? "bg-white text-[#365f4d] shadow-sm"
                      : "text-slate-700 hover:bg-white hover:text-[#365f4d]"
                  }
                `}
              >
                Serviços

                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    ddServicos ? "rotate-180" : ""
                  }`}
                />
              </button>

              {ddServicos && (
                <div
                  role="menu"
                  className="
                    absolute left-1/2 top-[calc(100%+14px)]
                    z-[130] w-[325px] -translate-x-1/2
                    rounded-3xl border border-slate-200
                    bg-white p-2
                    shadow-[0_22px_60px_rgba(15,23,42,0.18)]
                  "
                >
                  <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-slate-200 bg-white" />

                  <div className="relative">
                    <div className="px-3 pb-2 pt-2">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#71845e]">
                        Nossos serviços
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Atendimento completo para compradores e proprietários.
                      </p>
                    </div>

                    <div className="grid gap-1">
                      {SERVICOS_ITEMS.map((item) => {
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            role="menuitem"
                            onClick={closeEverything}
                            className="
                              group flex items-center gap-3 rounded-2xl
                              px-3 py-3 transition
                              hover:bg-[#f2f6ef]
                            "
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf3e9] text-[#527043]">
                              <Icon className="h-4.5 w-4.5" />
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-bold text-slate-800">
                                {item.label}
                              </span>

                              <span className="mt-0.5 block text-xs leading-4 text-slate-500">
                                {item.description}
                              </span>
                            </span>

                            <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#527043]" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Imóveis */}
            <div ref={imoveisRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={ddImoveis}
                onClick={() => {
                  setDdImoveis((current) => !current);
                  setDdEmpresa(false);
                  setDdServicos(false);
                }}
                className={`
                  inline-flex h-10 items-center gap-1.5 rounded-full
                  px-4 text-sm font-semibold transition
                  ${
                    ddImoveis || imoveisActive
                      ? "bg-white text-[#365f4d] shadow-sm"
                      : "text-slate-700 hover:bg-white hover:text-[#365f4d]"
                  }
                `}
              >
                Imóveis

                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    ddImoveis ? "rotate-180" : ""
                  }`}
                />
              </button>

              {ddImoveis && (
                <div
                  role="menu"
                  className="
                    absolute left-1/2 top-[calc(100%+14px)]
                    z-[130] w-[300px] -translate-x-1/2
                    rounded-3xl border border-slate-200
                    bg-white p-2
                    shadow-[0_22px_60px_rgba(15,23,42,0.18)]
                  "
                >
                  <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-slate-200 bg-white" />

                  <div className="relative">
                    <div className="px-3 pb-2 pt-2">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#71845e]">
                        Encontre seu imóvel
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Acesse rapidamente nosso catálogo.
                      </p>
                    </div>

                    <div className="grid gap-1">
                      {IMOVEIS_ITEMS.map((item) => {
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            role="menuitem"
                            onClick={closeEverything}
                            className="
                              group flex items-center gap-3 rounded-2xl
                              px-3 py-3 transition
                              hover:bg-[#f2f6ef]
                            "
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf3e9] text-[#527043]">
                              <Icon className="h-4.5 w-4.5" />
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-bold text-slate-800">
                                {item.label}
                              </span>

                              <span className="mt-0.5 block text-xs leading-4 text-slate-500">
                                {item.description}
                              </span>
                            </span>

                            <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#527043]" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Ações */}
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Link
              href="/admin"
              className="
                hidden h-11 items-center gap-2 rounded-full
                border border-slate-200 bg-white px-4
                text-sm font-semibold text-slate-700
                shadow-sm transition
                hover:border-[#8aa078] hover:text-[#365f4d]
                sm:inline-flex
              "
            >
              <CircleUserRound className="h-4 w-4" />
              Login
            </Link>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp"
              className="
                group inline-flex h-11 items-center justify-center gap-2
                rounded-full bg-[#169447] px-3
                text-sm font-bold text-white
                shadow-[0_8px_22px_rgba(22,148,71,0.28)]
                transition
                hover:-translate-y-0.5 hover:bg-[#117c3b]
                hover:shadow-[0_11px_28px_rgba(22,148,71,0.35)]
                xl:px-4
              "
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                aria-hidden="true"
                className="fill-white"
              >
                <path d="M20.52 3.48A11.86 11.86 0 0012.02 0C5.4 0 .02 5.38.02 12c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.62A11.93 11.93 0 0012.02 24C18.64 24 24 18.62 24 12c0-3.2-1.25-6.21-3.48-8.52zM12.02 22.02c-1.84 0-3.65-.5-5.23-1.44l-.38-.23-3.68.96.98-3.59-.25-.37A9.97 9.97 0 012 12C2 6.49 6.5 2 12.02 2c2.66 0 5.16 1.04 7.04 2.93A9.9 9.9 0 0122 12c0 5.52-4.49 10.02-9.98 10.02zm5.84-7.54c-.32-.16-1.88-.93-2.17-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.36.24-.68.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.36.48-.54.16-.18.21-.32.32-.54.11-.21.05-.41-.03-.57-.08-.16-.71-1.71-.98-2.34-.26-.63-.53-.54-.71-.55h-.61c-.21 0-.54.08-.82.41-.28.32-1.07 1.04-1.07 2.54s1.09 2.95 1.25 3.16c.16.21 2.14 3.26 5.18 4.57.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.88-.77 2.14-1.5.26-.73.26-1.36.18-1.5-.08-.14-.29-.23-.61-.39z" />
              </svg>

              <span className="hidden xl:inline">
                WhatsApp
              </span>
            </a>

            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-navbar-menu"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => {
                setOpen((current) => !current);
                closeAllDropdowns();
              }}
              className="
                inline-flex h-11 w-11 items-center justify-center
                rounded-full border border-slate-200
                bg-white text-slate-700 shadow-sm
                transition hover:border-[#8aa078]
                hover:bg-[#f2f6ef] hover:text-[#365f4d]
                md:hidden
              "
            >
              {open ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {open && (
          <div
            id="mobile-navbar-menu"
            className="
              absolute inset-x-0 top-full z-[120]
              max-h-[calc(100vh-78px)] overflow-y-auto
              border-t border-slate-200
              bg-white/98 shadow-[0_24px_50px_rgba(15,23,42,0.16)]
              backdrop-blur-xl
              md:hidden
            "
          >
            <div className="mx-auto max-w-6xl px-4 py-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between px-2 pb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#71845e]">
                      Navegação
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Encontre rapidamente o que procura.
                    </p>
                  </div>

                  <MapPin className="h-5 w-5 text-[#668052]" />
                </div>

                <div className="grid gap-3">
                  {[
                    {
                      title: "Empresa",
                      items: EMPRESA_ITEMS,
                    },
                    {
                      title: "Serviços",
                      items: SERVICOS_ITEMS,
                    },
                    {
                      title: "Imóveis",
                      items: IMOVEIS_ITEMS,
                    },
                  ].map((section) => (
                    <section
                      key={section.title}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-2"
                    >
                      <p className="px-2 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                        {section.title}
                      </p>

                      <div className="grid grid-cols-2 gap-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;

                          return (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={closeEverything}
                              className="
                                flex min-h-[54px] items-center gap-2
                                rounded-xl bg-white px-3 py-2
                                text-sm font-semibold text-slate-700
                                transition hover:bg-[#edf3e9]
                                hover:text-[#365f4d]
                              "
                            >
                              <Icon className="h-4 w-4 shrink-0 text-[#668052]" />

                              <span className="leading-4">
                                {item.label}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <Link
                    href="/admin"
                    onClick={closeEverything}
                    className="
                      flex min-h-12 items-center justify-center gap-2
                      rounded-2xl border border-slate-200
                      bg-white px-4 text-sm font-bold text-slate-700
                      transition hover:border-[#8aa078]
                      hover:text-[#365f4d]
                    "
                  >
                    <CircleUserRound className="h-4 w-4" />
                    Acessar login
                  </Link>

                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeEverything}
                    className="
                      flex min-h-12 items-center justify-center gap-2
                      rounded-2xl bg-[#169447]
                      px-4 text-sm font-bold text-white
                      transition hover:bg-[#117c3b]
                    "
                  >
                    <MessageCircle className="h-4 w-4" />
                    Falar no WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Espaçador da navbar fixa na Home */}
      {isHome && (
        <div
          aria-hidden="true"
          style={{ height: navHeight }}
        />
      )}
    </>
  );
}