import Link from "next/link";

type PaginationProps = {
  basePath: string; // ex: "/imoveis" ou "/admin/imoveis"
  currentPage: number;
  totalPages: number;
  searchParams?: Record<string, string | string[] | undefined>;
};

function toSingle(v: string | string[] | undefined) {
  if (!v) return "";
  return Array.isArray(v) ? v[0] ?? "" : v;
}

function buildHref(
  basePath: string,
  searchParams: Record<string, string | string[] | undefined> | undefined,
  page: number
) {
  const params = new URLSearchParams();

  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) {
      if (k === "page") continue; // vamos sobrescrever
      const val = toSingle(v);
      if (val !== "") params.set(k, val);
    }
  }

  params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function PageLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "h-10 min-w-10 px-3 inline-flex items-center justify-center rounded-xl border text-sm",
        active ? "bg-slate-900 text-white border-slate-900" : "hover:bg-neutral-50",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export default function Pagination({
  basePath,
  currentPage,
  totalPages,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const hrefFirst = buildHref(basePath, searchParams, 1);
  const hrefPrev = buildHref(basePath, searchParams, Math.max(1, safePage - 1));
  const hrefNext = buildHref(basePath, searchParams, Math.min(totalPages, safePage + 1));
  const hrefLast = buildHref(basePath, searchParams, totalPages);

  const pages: number[] = [];
  const windowStart = Math.max(1, safePage - 2);
  const windowEnd = Math.min(totalPages, safePage + 2);

  for (let p = windowStart; p <= windowEnd; p++) pages.push(p);

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <PageLink href={hrefFirst}>«</PageLink>
      <PageLink href={hrefPrev}>‹</PageLink>

      {windowStart > 1 ? <span className="px-2 text-neutral-500">…</span> : null}

      {pages.map((p) => (
        <PageLink
          key={p}
          href={buildHref(basePath, searchParams, p)}
          active={p === safePage}
        >
          {p}
        </PageLink>
      ))}

      {windowEnd < totalPages ? <span className="px-2 text-neutral-500">…</span> : null}

      <PageLink href={hrefNext}>›</PageLink>
      <PageLink href={hrefLast}>»</PageLink>
    </div>
  );
}