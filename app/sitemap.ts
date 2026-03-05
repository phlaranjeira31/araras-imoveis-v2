export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const imoveis = await prisma.imovel.findMany({
    where: { ativo: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const imoveisUrls: MetadataRoute.Sitemap = imoveis.map((i) => ({
    url: `${baseUrl}/imovel/${i.slug}`,
    lastModified: i.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/imoveis`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...imoveisUrls,
  ];
}
