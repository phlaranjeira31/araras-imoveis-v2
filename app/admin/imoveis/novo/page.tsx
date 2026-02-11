"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MapPicker from "@/components/MapPickerClientOnly";

function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

function formatMoneyBRLFromDigits(digits: string) {
  // digits = "2500000" -> "R$ 2.500.000"
  const n = Number(digits || "0");
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString("pt-BR");
}

export default function NovoImovelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // básicos
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [cep, setCep] = useState("");

  // finalidade
  const [purpose, setPurpose] = useState<
    "comprar" | "alugar" | "temporada" | "lancamentos" | "todos"
  >("todos");

  // preço (guardamos só dígitos)
  const [priceDigits, setPriceDigits] = useState("");

  // mapa
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  // --- NOVOS CAMPOS ---
  const [tipo, setTipo] = useState<string>("");
  const [quartos, setQuartos] = useState<string>("");
  const [suites, setSuites] = useState<string>("");
  const [banheiros, setBanheiros] = useState<string>("");
  const [vagas, setVagas] = useState<string>("");

  const [areaConstruida, setAreaConstruida] = useState<string>("");
  const [areaTerreno, setAreaTerreno] = useState<string>("");

  const [mobiliado, setMobiliado] = useState<boolean>(false);
  const [condominio, setCondominio] = useState<string>("");
  const [iptu, setIptu] = useState<string>("");

  const [descricao, setDescricao] = useState<string>("");

  // ✅ ADICIONADO: condomínio (nome) + código do imóvel (único)
  const [condominioNome, setCondominioNome] = useState<string>("");
  const [codigo, setCodigo] = useState<string>("");

  // ✅ ADICIONADO: área do proprietário
  const [proprietarioNome, setProprietarioNome] = useState<string>("");
  const [proprietarioTelefone, setProprietarioTelefone] = useState<string>("");
  const [proprietarioCpf, setProprietarioCpf] = useState<string>("");
  const [proprietarioEmail, setProprietarioEmail] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title,
        city,
        neighborhood,
        cep: cep || null,

        purpose,

        // ✅ AJUSTE (SEM MEXER NO RESTO): alguns endpoints usam "finalidade" ou "negocio"
        // e podem estar ignorando "purpose" — isso garante que o valor chegue.
        finalidade: purpose,
        negocio: purpose,

        price: priceDigits ? Number(priceDigits) : null,
        lat,
        lng,

        // novos
        tipo: tipo || null,
        quartos: quartos ? Number(quartos) : null,
        suites: suites ? Number(suites) : null,
        banheiros: banheiros ? Number(banheiros) : null,
        vagas: vagas ? Number(vagas) : null,
        areaConstruida: areaConstruida ? Number(areaConstruida) : null,
        areaTerreno: areaTerreno ? Number(areaTerreno) : null,
        mobiliado,
        condominio: condominio ? Number(condominio) : null,
        iptu: iptu ? Number(iptu) : null,
        descricao: descricao || null,

        // ✅ ADICIONADO: nome do condomínio + código do imóvel
        condominioNome: condominioNome || null,
        codigo: codigo || null,

        // ✅ ADICIONADO: proprietário
        proprietarioNome: proprietarioNome || null,
        proprietarioTelefone: proprietarioTelefone || null,
        proprietarioCpf: proprietarioCpf || null,
        proprietarioEmail: proprietarioEmail || null,
      };

      const res = await fetch("/api/imoveis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // ✅ ADICIONADO: mensagem mais clara para código duplicado (quando prisma @unique barrar)
        const msg = String(data?.error || "Erro ao salvar imóvel.");
        if (
          msg.toLowerCase().includes("unique") ||
          msg.toLowerCase().includes("código") ||
          msg.toLowerCase().includes("codigo")
        ) {
          alert("Esse código do imóvel já existe. Por favor, escolha outro.");
        } else {
          alert(msg);
        }
        return;
      }

      const id = data?.imovel?.id;
      if (!id) {
        alert("Imóvel salvo, mas não retornou o ID.");
        return;
      }

      // vai para a tela de fotos (fluxo que vocês já usam)
      router.push(`/admin/imoveis/${id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Cadastrar imóvel</h1>

      <form onSubmit={onSubmit} className="mt-8 space-y-8">
        {/* BÁSICOS */}
        <section className="rounded-2xl border bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Informações principais</h2>

          <div className="mt-5 grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium">Título do imóvel *</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Casa alto padrão em Itaipava"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Cidade *</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Petrópolis"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Bairro *</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Itaipava"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">CEP</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="Ex: 25650-000"
                />
                <p className="mt-1 text-xs text-slate-500">
                  (Opcional) Depois vamos usar isso pra localizar no mapa.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Finalidade</label>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 bg-white"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as any)}
                >
                  <option value="todos">Todos</option>
                  <option value="comprar">Comprar</option>
                  <option value="alugar">Alugar</option>
                  <option value="temporada">Temporada</option>
                  <option value="lancamentos">Lançamentos</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Preço</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                  value={priceDigits ? `R$ ${formatMoneyBRLFromDigits(priceDigits)}` : ""}
                  onChange={(e) => setPriceDigits(onlyDigits(e.target.value))}
                  inputMode="numeric"
                  placeholder="Ex: R$ 2.500.000"
                />
              </div>
            </div>
          </div>
        </section>

        {/* DETALHES */}
        <section className="rounded-2xl border bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Detalhes do imóvel</h2>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <select
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 bg-white"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="">Selecione…</option>
                <option value="Casa">Casa</option>
                <option value="Casa em Condomínio">Casa em Condomínio</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Cobertura">Cobertura</option>
                <option value="Terreno">Terreno</option>
                <option value="Terreno em Condomínio">Terreno em Condomínio</option>
                <option value="Comercial">Comercial</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Quartos</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                value={quartos}
                onChange={(e) => setQuartos(onlyDigits(e.target.value))}
                inputMode="numeric"
                placeholder="Ex: 4"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Suítes</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                value={suites}
                onChange={(e) => setSuites(onlyDigits(e.target.value))}
                inputMode="numeric"
                placeholder="Ex: 2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Banheiros</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                value={banheiros}
                onChange={(e) => setBanheiros(onlyDigits(e.target.value))}
                inputMode="numeric"
                placeholder="Ex: 5"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Vagas</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                value={vagas}
                onChange={(e) => setVagas(onlyDigits(e.target.value))}
                inputMode="numeric"
                placeholder="Ex: 3"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Área construída (m²)</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                value={areaConstruida}
                onChange={(e) => setAreaConstruida(onlyDigits(e.target.value))}
                inputMode="numeric"
                placeholder="Ex: 320"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Área do terreno (m²)</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                value={areaTerreno}
                onChange={(e) => setAreaTerreno(onlyDigits(e.target.value))}
                inputMode="numeric"
                placeholder="Ex: 1200"
              />
            </div>

            <div className="flex items-end gap-3">
              <input
                id="mobiliado"
                type="checkbox"
                checked={mobiliado}
                onChange={(e) => setMobiliado(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="mobiliado" className="text-sm font-medium">
                Mobiliado
              </label>
            </div>

            <div>
              <label className="text-sm font-medium">Condomínio (R$)</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                value={condominio}
                onChange={(e) => setCondominio(onlyDigits(e.target.value))}
                inputMode="numeric"
                placeholder="Ex: 3000"
              />
            </div>

            {/* ✅ ADICIONADO: NOME DO CONDOMÍNIO */}
            <div>
              <label className="text-sm font-medium">Nome do condomínio</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                value={condominioNome}
                onChange={(e) => setCondominioNome(e.target.value)}
                placeholder="Ex: Bela Vista"
              />
            </div>

            <div>
              <label className="text-sm font-medium">IPTU (R$)</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                value={iptu}
                onChange={(e) => setIptu(onlyDigits(e.target.value))}
                inputMode="numeric"
                placeholder="Ex: 8500"
              />
            </div>

            {/* ✅ ADICIONADO: CÓDIGO DO IMÓVEL (ÚNICO) */}
            <div>
              <label className="text-sm font-medium">Código do imóvel (único)</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ex: AR-102"
              />
              <p className="mt-1 text-xs text-slate-500">
                Não pode repetir. Se já existir, o sistema vai barrar.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium">Descrição</label>
            <textarea
              className="mt-1 w-full min-h-[140px] rounded-xl border px-3 py-2 outline-none focus:ring-2"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o imóvel: diferenciais, lazer, acabamentos, segurança, vista, etc."
            />
          </div>
        </section>

        {/* ✅ ADICIONADO: ÁREA DO PROPRIETÁRIO */}
        <section className="rounded-2xl border bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Área do proprietário</h2>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                value={proprietarioNome}
                onChange={(e) => setProprietarioNome(e.target.value)}
                placeholder="Ex: João da Silva"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Telefone</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                value={proprietarioTelefone}
                onChange={(e) => setProprietarioTelefone(e.target.value)}
                placeholder="Ex: (21) 99999-9999"
              />
            </div>

            <div>
              <label className="text-sm font-medium">CPF</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                value={proprietarioCpf}
                onChange={(e) => setProprietarioCpf(e.target.value)}
                placeholder="Ex: 000.000.000-00"
              />
            </div>

            <div>
              <label className="text-sm font-medium">E-mail</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                value={proprietarioEmail}
                onChange={(e) => setProprietarioEmail(e.target.value)}
                placeholder="Ex: dono@email.com"
              />
            </div>
          </div>
        </section>

        {/* MAPA */}
        <section className="rounded-2xl border bg-white p-6 shadow-soft">
          <MapPicker
            lat={lat}
            lng={lng}
            onChange={(v) => {
              setLat(v.lat);
              setLng(v.lng);
            }}
          />
        </section>

        <button
          disabled={loading}
          className="w-full rounded-xl bg-leaf px-4 py-3 text-white font-semibold disabled:opacity-60"
          type="submit"
        >
          {loading ? "Salvando..." : "Salvar imóvel e adicionar fotos"}
        </button>
      </form>
    </main>
  );
}










