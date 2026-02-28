import Link from "next/link";

export function Pagination({
  page,
  pageCount,
  basePath
}: {
  page: number;
  pageCount: number;
  basePath: string;
}) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <nav className="pagination">
      {page > 1 ? <Link href={`${basePath}${page - 1}`}>Попередня</Link> : <span />}
      <span>
        Сторінка {page} / {pageCount}
      </span>
      {page < pageCount ? <Link href={`${basePath}${page + 1}`}>Наступна</Link> : <span />}
    </nav>
  );
}

