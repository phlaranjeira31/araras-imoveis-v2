export const metadata = {
  title: "Política de Privacidade | Araras Imóveis",
  description:
    "Saiba como a Araras Imóveis trata seus dados e utiliza cookies para melhorar sua experiência.",
};

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-zinc-900">
        Política de Privacidade
      </h1>

      <p className="mt-4 text-zinc-700">
        A Araras Imóveis valoriza a sua privacidade. Esta página explica como
        coletamos, usamos e protegemos informações quando você navega em nosso
        site.
      </p>

      <div className="mt-8 space-y-6 text-zinc-700">
        <section>
          <h2 className="text-xl font-semibold text-zinc-900">
            1. Coleta de informações
          </h2>
          <p className="mt-2">
            Podemos coletar informações fornecidas por você (por exemplo, ao
            entrar em contato) e informações de navegação (como páginas
            acessadas), para melhorar nossos serviços e sua experiência.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">
            2. Uso das informações
          </h2>
          <p className="mt-2">
            Usamos as informações para: responder solicitações, melhorar o
            conteúdo do site, entender preferências e otimizar a experiência do
            usuário.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">
            3. Cookies e tecnologias similares
          </h2>
          <p className="mt-2">
            Cookies são pequenos arquivos salvos no seu navegador. Eles ajudam a
            lembrar preferências e a melhorar a performance. Você pode gerenciar
            cookies nas configurações do seu navegador.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">
            4. Compartilhamento de dados
          </h2>
          <p className="mt-2">
            Não vendemos seus dados. Podemos compartilhar informações apenas
            quando necessário para operação do serviço (ex.: hospedagem) ou por
            obrigação legal.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">
            5. Segurança
          </h2>
          <p className="mt-2">
            Adotamos medidas de segurança para proteger seus dados, mas nenhum
            sistema é 100% infalível. Recomendamos que você mantenha seus
            dispositivos protegidos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">
            6. Atualizações desta política
          </h2>
          <p className="mt-2">
            Podemos atualizar esta política para refletir melhorias e mudanças
            legais. Recomendamos revisar esta página periodicamente.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">7. Contato</h2>
          <p className="mt-2">
            Se tiver dúvidas sobre esta Política de Privacidade, entre em
            contato pelo canal disponível na página de contato do site.
          </p>
        </section>
      </div>

      <div className="mt-10 rounded-2xl border border-zinc-200 bg-white/70 p-5 text-sm text-zinc-600">
        <p>
          Última atualização: <span className="font-medium">2026</span>
        </p>
      </div>
    </div>
  );
}