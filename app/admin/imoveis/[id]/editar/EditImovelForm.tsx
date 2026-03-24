"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Home,
  User,
  BadgeDollarSign,
} from "lucide-react";

type DefaultValues = {
  title: string;
  slug: string;
  city: string;
  neighborhood: string;
  cep: string;
  tipo: string;
  purpose: string;
  price: string;
  priceRent: string;
  descricao: string;
  proprietarioNome: string;
  proprietarioTelefone: string;
  condominioNome: string;
  codigo: string;
  endereco: string;
  corretoraCaptacao: string;
  condominio: string;
  iptu: string;
};

const CORRETORAS = ["Lidiane Farias", "Ana Andrade", "Claudia Raposo", "Elis"];

/**
 * Máscara em REAIS inteiros, no mesmo padrão do cadastro novo:
 * "5000" -> "R$ 5.000"
 * "700" -> "R$ 700"
 * sem centavos
 */
function formatCurrencyBRLFromDigits(value: string) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return "";

  const number = Number(digits);
  if (!Number.isFinite(number)) return "";

  return `R$ ${number.toLocaleString("pt-BR")}`;
}

export default function EditImovelForm({
  id,
  defaultValues,
}: {
  id: string;
  defaultValues: DefaultValues;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // guardamos só a máscara visual, mas sempre em reais inteiros
  const [priceMasked, setPriceMasked] = useState(
    defaultValues.price ? formatCurrencyBRLFromDigits(defaultValues.price) : ""
  );

  const [priceRentMasked, setPriceRentMasked] = useState(
    defaultValues.priceRent
      ? formatCurrencyBRLFromDigits(defaultValues.priceRent)
      : ""
  );

  const [condominioMasked, setCondominioMasked] = useState(
    defaultValues.condominio
      ? formatCurrencyBRLFromDigits(defaultValues.condominio)
      : ""
  );

  const [iptuMasked, setIptuMasked] = useState(
    defaultValues.iptu ? formatCurrencyBRLFromDigits(defaultValues.iptu) : ""
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOkMsg("");
    setErrMsg("");
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const corretoraRaw = String(form.get("corretoraCaptacao") ?? "").trim();
    const corretoraCaptacao =
      !corretoraRaw || corretoraRaw === "Todas" ? null : corretoraRaw;

    const payload = {
      title: String(form.get("title") ?? "").trim(),
      slug: String(form.get("slug") ?? "").trim(),
      city: String(form.get("city") ?? "").trim(),
      neighborhood: String(form.get("neighborhood") ?? "").trim(),
      cep: String(form.get("cep") ?? "").trim(),
      tipo: String(form.get("tipo") ?? "").trim(),
      purpose: String(form.get("purpose") ?? "").trim(),

      // manda só dígitos, em reais inteiros
      price: priceMasked.replace(/\D/g, ""),
      priceRent: priceRentMasked.replace(/\D/g, ""),

      descricao: String(form.get("descricao") ?? "").trim(),
      proprietarioNome: String(form.get("proprietarioNome") ?? "").trim(),
      proprietarioTelefone: String(
        form.get("proprietarioTelefone") ?? ""
      ).trim(),
      condominioNome: String(form.get("condominioNome") ?? "").trim(),
      codigo: String(form.get("codigo") ?? "").trim(),
      endereco: String(form.get("endereco") ?? "").trim(),
      corretoraCaptacao,

      condominio: condominioMasked.replace(/\D/g, ""),
      iptu: iptuMasked.replace(/\D/g, ""),
    };

    try {
      const res = await fetch(`/api/admin/imoveis/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Erro ao salvar alterações.");
      }

      setOkMsg("Salvo com sucesso.");
      router.refresh();
    } catch (err: any) {
      setErrMsg(err?.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border p-5 space-y-5 bg-white/70"
    >
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold text-neutral-800">
            Informações Principais
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Título" name="title" defaultValue={defaultValues.title} />
          <Field label="Slug" name="slug" defaultValue={defaultValues.slug} />

          <Field label="Cidade" name="city" defaultValue={defaultValues.city} />
          <Field
            label="Bairro"
            name="neighborhood"
            defaultValue={defaultValues.neighborhood}
          />

          <Field label="CEP" name="cep" defaultValue={defaultValues.cep} />

          <Field
            label="Endereço do imóvel (interno)"
            name="endereco"
            defaultValue={defaultValues.endereco}
            placeholder="Ex: Estrada União Indústria, 9500, Itaipava"
          />

          <Field label="Tipo" name="tipo" defaultValue={defaultValues.tipo} />

          <Field
            label="Finalidade"
            name="purpose"
            defaultValue={defaultValues.purpose}
            placeholder="ex: comprar | alugar | alugar_comprar"
          />

          <Field
            label="Código do imóvel"
            name="codigo"
            defaultValue={defaultValues.codigo}
            placeholder="ex: AR-102"
          />

          <Field
            label="Nome do condomínio"
            name="condominioNome"
            defaultValue={defaultValues.condominioNome}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <BadgeDollarSign className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold text-neutral-800">Valores</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-neutral-700">
              Preço
            </label>
            <input
              name="price"
              value={priceMasked}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setPriceMasked(digits ? formatCurrencyBRLFromDigits(digits) : "");
              }}
              inputMode="numeric"
              placeholder="Ex: R$ 2.800.000"
              className="h-11 rounded-2xl border px-3 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-neutral-700">
              Preço Locação
            </label>
            <input
              name="priceRent"
              value={priceRentMasked}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setPriceRentMasked(
                  digits ? formatCurrencyBRLFromDigits(digits) : ""
                );
              }}
              inputMode="numeric"
              placeholder="Ex: R$ 5.000"
              className="h-11 rounded-2xl border px-3 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-neutral-700">
              Condomínio
            </label>
            <input
              name="condominio"
              value={condominioMasked}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setCondominioMasked(
                  digits ? formatCurrencyBRLFromDigits(digits) : ""
                );
              }}
              inputMode="numeric"
              placeholder="Ex: R$ 700"
              className="h-11 rounded-2xl border px-3 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-neutral-700">
              IPTU
            </label>
            <input
              name="iptu"
              value={iptuMasked}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setIptuMasked(digits ? formatCurrencyBRLFromDigits(digits) : "");
              }}
              inputMode="numeric"
              placeholder="Ex: R$ 2.600"
              className="h-11 rounded-2xl border px-3 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold text-neutral-800">
            Proprietário e Captação
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Proprietário"
            name="proprietarioNome"
            defaultValue={defaultValues.proprietarioNome}
          />

          <Field
            label="Telefone do proprietário"
            name="proprietarioTelefone"
            defaultValue={defaultValues.proprietarioTelefone}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-neutral-700">
              Corretora (captação)
            </label>

            <input
              type="text"
              name="corretoraCaptacao"
              list="lista-corretoras-captacao"
              defaultValue={defaultValues.corretoraCaptacao ?? ""}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Digite ou selecione a corretora"
            />

            <datalist id="lista-corretoras-captacao">
              {CORRETORAS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Home className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold text-neutral-800">Descrição</h2>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-700">
            Descrição
          </label>
          <textarea
            name="descricao"
            defaultValue={defaultValues.descricao}
            rows={6}
            className="rounded-2xl border px-3 py-2 text-sm"
            placeholder="Descrição completa do imóvel..."
          />
        </div>
      </section>

      {errMsg ? (
        <div className="text-sm rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2">
          {errMsg}
        </div>
      ) : null}

      {okMsg ? (
        <div className="text-sm rounded-xl border border-green-200 bg-green-50 text-green-800 px-3 py-2">
          {okMsg}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-green-700 text-white hover:opacity-90 text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  inputMode,
}: {
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-neutral-700">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        inputMode={inputMode}
        className="h-11 rounded-2xl border px-3 text-sm"
      />
    </div>
  );
}