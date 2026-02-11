import RegionsFilterClient from "@/components/RegionsFilterClient";
import prisma from "@/lib/prisma";

type Row = {
  city: string | null;
  neighborhood: string | null;
};

function norm(s: string) {
  return s.trim();
}

export default async function RegionsFilterServer() {
  const rows: Row[] = await prisma.imovel.findMany({
    select: { city: true, neighborhood: true },
  });

  const map = new Map<
    string,
    { city: string; neighborhood: string; count: number }
  >();

  for (const r of rows) {
    const city = norm(r.city ?? "");
    const neighborhood = norm(r.neighborhood ?? "");
    if (!city || !neighborhood) continue;

    const key = `${city}|||${neighborhood}`;
    const item = map.get(key);
    if (item) item.count += 1;
    else map.set(key, { city, neighborhood, count: 1 });
  }

  const items = Array.from(map.values()).sort((a, b) => {
    const c = a.city.localeCompare(b.city, "pt-BR");
    if (c !== 0) return c;
    return a.neighborhood.localeCompare(b.neighborhood, "pt-BR");
  });

  const cities = Array.from(new Set(items.map((i) => i.city))).sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );

  return <RegionsFilterClient items={items} cities={cities} />;
}




