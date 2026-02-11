export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // pode ser texto simples por enquanto
  cover?: string;  // ex: "/blog/capa-1.jpg" (coloque em /public/blog)
  category?: string;
  date: string; // "2026-02-09"
};

export const blogPosts: BlogPost[] = [
  {
    slug: "lancamento-bela-vista-itaipava",
    title: "Lançamento: Bela Vista em Itaipava",
    excerpt:
      "Conheça os diferenciais do novo empreendimento e o que considerar antes de investir.",
    content: `
O Bela Vista chega a Itaipava com uma proposta premium e excelente localização.

• Tipologias e plantas pensadas para conforto
• Infraestrutura completa de condomínio
• Potencial de valorização e liquidez

Quer saber mais? Fale com a Araras Imóveis e agende uma visita.
    `.trim(),
    cover: "/blog/capa-bela-vista.jpg",
    category: "Empreendimentos",
    date: "2026-02-09",
  },
  {
    slug: "dicas-para-comprar-imovel-serra",
    title: "5 dicas para comprar imóvel na Serra com segurança",
    excerpt:
      "Checklist prático: documentação, visita técnica, condomínio, localização e negociação.",
    content: `
Comprar um imóvel exige atenção aos detalhes.

1) Verifique documentação (matrícula, ônus, IPTU)
2) Avalie condomínio e custos recorrentes
3) Faça visita em horários diferentes
4) Entenda o entorno e acessos
5) Negocie com base em mercado e condição do imóvel
    `.trim(),
    category: "Conteúdo",
    date: "2026-02-08",
  },
];
