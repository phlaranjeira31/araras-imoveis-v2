"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  Search,
  X,
} from "lucide-react";

type ImovelOption = {
  id: string;
  codigo: string | null;
  title: string;
  neighborhood: string;
  city: string;
  valor: string | null;
};

type MultiImovelSelectProps = {
  imoveis: ImovelOption[];
};

export default function MultiImovelSelect({
  imoveis,
}: MultiImovelSelectProps) {
  const [aberto, setAberto] =
    useState(false);

  const [busca, setBusca] =
    useState("");

  const [selecionados, setSelecionados] =
    useState<string[]>([]);

  const imoveisPorId = useMemo(
    () =>
      new Map(
        imoveis.map((imovel) => [
          imovel.id,
          imovel,
        ])
      ),
    [imoveis]
  );

  const filtrados = useMemo(() => {
    const termo = busca
      .trim()
      .toLocaleLowerCase("pt-BR");

    if (!termo) {
      return imoveis;
    }

    return imoveis.filter((imovel) =>
      [
        imovel.codigo,
        imovel.title,
        imovel.neighborhood,
        imovel.city,
        imovel.valor,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("pt-BR")
        .includes(termo)
    );
  }, [busca, imoveis]);

  function alternar(imovelId: string) {
    setSelecionados((atuais) => {
      if (atuais.includes(imovelId)) {
        return atuais.filter(
          (id) => id !== imovelId
        );
      }

      return [...atuais, imovelId];
    });
  }

  function remover(imovelId: string) {
    setSelecionados((atuais) =>
      atuais.filter(
        (id) => id !== imovelId
      )
    );
  }

  const selecionadosDetalhes =
    selecionados
      .map((id) => imoveisPorId.get(id))
      .filter(
        (imovel): imovel is ImovelOption =>
          Boolean(imovel)
      );

  return (
    <div className="space-y-3">
      {/* Valores enviados para a Server Action */}
      {selecionados.map((id) => (
        <input
          key={id}
          type="hidden"
          name="imovelIds"
          value={id}
        />
      ))}

      <div>
        <span className="mb-1.5 block text-[10px] font-semibold text-slate-600">
          Imóveis relacionados
        </span>

        <button
          type="button"
          onClick={() =>
            setAberto((atual) => !atual)
          }
          className={`flex min-h-11 w-full items-center gap-3 rounded-xl border bg-[#fbfcfb] px-3.5 text-left text-xs outline-none transition ${
            aberto
              ? "border-[#8da37d] ring-4 ring-[#6f895c]/10"
              : "border-slate-200 hover:border-[#b8c7af]"
          }`}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#edf4e9] text-[#527443]">
            <Building2 className="h-3.5 w-3.5" />
          </span>

          <span className="min-w-0 flex-1">
            {selecionados.length === 0
              ? "Selecionar um ou mais imóveis"
              : selecionados.length === 1
                ? "1 imóvel selecionado"
                : `${selecionados.length} imóveis selecionados`}
          </span>

          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
              aberto ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Imóveis já selecionados */}
      {selecionadosDetalhes.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#668052]">
              Selecionados
            </p>

            <span className="text-[9px] text-slate-400">
              O primeiro é o imóvel principal
            </span>
          </div>

          <div className="grid gap-2 lg:grid-cols-2">
            {selecionadosDetalhes.map(
              (imovel, index) => (
                <div
                  key={imovel.id}
                  className="flex items-start gap-3 rounded-xl border border-[#dfe8da] bg-[#f8fbf6] p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#527443] shadow-sm">
                    <Building2 className="h-3.5 w-3.5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="truncate text-[10px] font-bold text-slate-800">
                        {imovel.codigo
                          ? `${imovel.codigo} • `
                          : ""}
                        {imovel.title}
                      </p>

                      {index === 0 ? (
                        <span className="rounded-full bg-[#e7f1e2] px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.1em] text-[#527443]">
                          Principal
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-1 truncate text-[9px] text-slate-400">
                      {[imovel.neighborhood, imovel.city, imovel.valor]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      remover(imovel.id)
                    }
                    aria-label={`Remover ${imovel.title}`}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      ) : null}

      {/* Painel de seleção */}
      {aberto ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <div className="border-b border-slate-100 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={busca}
                onChange={(event) =>
                  setBusca(event.target.value)
                }
                placeholder="Buscar por código, nome, bairro ou cidade..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-[#fbfcfb] pl-9 pr-3 text-[11px] text-slate-700 outline-none placeholder:text-slate-300 focus:border-[#8da37d] focus:ring-4 focus:ring-[#6f895c]/10"
              />
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto p-2">
            {filtrados.length === 0 ? (
              <div className="px-4 py-8 text-center text-[11px] text-slate-400">
                Nenhum imóvel encontrado.
              </div>
            ) : (
              filtrados.map((imovel) => {
                const selecionado =
                  selecionados.includes(
                    imovel.id
                  );

                return (
                  <button
                    key={imovel.id}
                    type="button"
                    onClick={() =>
                      alternar(imovel.id)
                    }
                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                      selecionado
                        ? "bg-[#edf4e9]"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                        selecionado
                          ? "border-[#527443] bg-[#527443] text-white"
                          : "border-slate-300 bg-white text-transparent"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[10px] font-bold text-slate-700">
                        {imovel.codigo
                          ? `${imovel.codigo} • `
                          : ""}
                        {imovel.title}
                      </span>

                      <span className="mt-1 block truncate text-[9px] text-slate-400">
                        {[imovel.neighborhood, imovel.city, imovel.valor]
                          .filter(Boolean)
                          .join(" • ")}
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-[#fbfcfb] px-3 py-2.5">
            <span className="text-[9px] font-semibold text-slate-500">
              {selecionados.length === 0
                ? "Nenhum imóvel selecionado"
                : `${selecionados.length} selecionado${
                    selecionados.length === 1
                      ? ""
                      : "s"
                  }`}
            </span>

            <button
              type="button"
              onClick={() => setAberto(false)}
              className="h-8 rounded-lg bg-[#365f4d] px-3 text-[9px] font-bold text-white transition hover:bg-[#294b3c]"
            >
              Concluir seleção
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
