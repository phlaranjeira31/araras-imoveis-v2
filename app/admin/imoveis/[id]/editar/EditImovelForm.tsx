"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DefaultValues = {
  title: string;
  slug: string;
  city: string;
  neighborhood: string;
  cep: string;
  tipo: string;
  purpose: string;
  price: string;
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

// ✅ FUNÇÃO DE MÁSCARA
function formatCurrencyBRL(value: string) {
  const digits = value.replace(/\D/g, "");
  const number = Number(digits) / 100;

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
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

  // ✅ STATES COM MÁSCARA
  const [priceMasked, setPriceMasked] = useState(
    defaultValues.price ? formatCurrencyBRL(defaultValues.price) : ""
  );

  const [condominioMasked, setCondominioMasked] = useState(
    defaultValues.condominio ? formatCurrencyBRL(defaultValues.condominio) : ""
  );

  const [iptuMasked, setIptuMasked] = useState(
    defaultValues.iptu ? formatCurrencyBRL(defaultValues.iptu) : ""
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

      // ✅ ENVIA VALOR LIMPO
      price: priceMasked.replace(/\D/g, ""),

      descricao: String(form.get("descricao") ?? "").trim(),
      proprietarioNome: String(form.get("proprietarioNome") ?? "").trim(),
      proprietarioTelefone: String(form.get("proprietarioTelefone") ?? "").trim(),
      condominioNome: String(form.get("condominioNome") ?? "").trim(),
      codigo: String(form.get("codigo") ?? "").trim(),
      endereco: String(form.get("endereco") ?? "").trim(),
      corretoraCaptacao,

      // ✅ ENVIA LIMPO
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
          placeholder="ex: comprar | alugar"
        />

        {/* ✅ PREÇO COM MÁSCARA */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-neutral-700">
            Preço
          </label>
          <input
            value={priceMasked}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              setPriceMasked(digits ? formatCurrencyBRL(digits) : "");
            }}
            inputMode="numeric"
            placeholder="Ex: R$ 2.800.000,00"
            className="h-11 rounded-2xl border px-3 text-sm"
          />
        </div>

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

        {/* ✅ CONDOMÍNIO COM MÁSCARA */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-neutral-700">
            Condomínio
          </label>
          <input
            value={condominioMasked}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              setCondominioMasked(digits ? formatCurrencyBRL(digits) : "");
            }}
            inputMode="numeric"
            placeholder="Ex: R$ 700,00"
            className="h-11 rounded-2xl border px-3 text-sm"
          />
        </div>

        {/* ✅ IPTU COM MÁSCARA */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-neutral-700">
            IPTU
          </label>
          <input
            value={iptuMasked}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              setIptuMasked(digits ? formatCurrencyBRL(digits) : "");
            }}
            inputMode="numeric"
            placeholder="Ex: R$ 2.600,00"
            className="h-11 rounded-2xl border px-3 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-neutral-700">Descrição</label>
        <textarea
          name="descricao"
          defaultValue={defaultValues.descricao}
          rows={6}
          className="rounded-2xl border px-3 py-2 text-sm"
          placeholder="Descrição completa do imóvel..."
        />
      </div>

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