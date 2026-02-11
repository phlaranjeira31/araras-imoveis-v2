// data/properties.ts

export type Property = {
  id: string;
  slug: string;
  title: string;
  purpose: "venda" | "aluguel" | "temporada";
  city: "Petrópolis" | "Itaipava" | "Araras";
  neighborhood?: string;
  price?: number;
  description?: string;

  // usado no card e na página do imóvel
  cover: string;
};

export const properties: Property[] = [
  {
    id: "1",
    slug: "casa-alto-padrao-araras",
    title: "Casa Alto Padrão em Araras",
    purpose: "venda",
    city: "Araras",
    neighborhood: "Araras",
    price: 3200000,
    description: "Casa exclusiva com vista para a natureza em Araras.",
    cover: "/imoveis/casa-araras.jpg",
  },
  {
    id: "2",
    slug: "apartamento-itaipava-centro",
    title: "Apartamento no Centro de Itaipava",
    purpose: "aluguel",
    city: "Itaipava",
    neighborhood: "Centro",
    price: 6500,
    description: "Apartamento moderno próximo ao comércio.",
    cover: "/imoveis/apto-itaipava.jpg",
  },
  {
    id: "3",
    slug: "casa-temporada-petropolis",
    title: "Casa para Temporada em Petrópolis",
    purpose: "temporada",
    city: "Petrópolis",
    neighborhood: "Centro",
    description: "Ideal para finais de semana e férias.",
    cover: "/imoveis/casa-petropolis.jpg",
  },
];








