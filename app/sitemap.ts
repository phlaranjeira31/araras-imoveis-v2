import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

// Atualiza o sitemap no máximo uma vez por hora.
// Evita consultar o Neon em toda visita ao /sitemap.xml.
export const revalidate = 3600;

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.ararasimoveis.net.br"
).replace(/\/+$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const imoveis = await prisma.imovel.findMany({
    where: {
      ativo: true,
    },
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const ultimaAtualizacao =
    imoveis.length > 0 ? imoveis[0].updatedAt : undefined;

  const paginasPrincipais: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      ...(ultimaAtualizacao
        ? { lastModified: ultimaAtualizacao }
        : {}),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/imoveis`,
      ...(ultimaAtualizacao
        ? { lastModified: ultimaAtualizacao }
        : {}),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const imoveisUrls: MetadataRoute.Sitemap = imoveis.map((imovel) => ({
    url: `${BASE_URL}/imovel/${imovel.slug}`,
    lastModified: imovel.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...paginasPrincipais, ...imoveisUrls];
}