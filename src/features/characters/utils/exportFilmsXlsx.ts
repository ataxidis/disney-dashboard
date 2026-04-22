import type { Character } from "../types/character";

export async function exportCurrentPageFilmsXlsx(
  characters: Character[],
  page: number,
) {
  const withFilms = characters.filter((c) => c.films.length > 0);
  const totalFilms = withFilms.reduce((sum, c) => sum + c.films.length, 0);

  const rows = withFilms.map((c) => {
    const filmCount = c.films.length;
    const percentage =
      totalFilms > 0 ? Number(((filmCount / totalFilms) * 100).toFixed(1)) : 0;
    return {
      Character: c.name,
      "Film Count": filmCount,
      "Percentage (%)": percentage,
      Films: c.films.join(", "),
    };
  });

  if (rows.length === 0) return;

  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Films by Character");
  XLSX.writeFile(workbook, `films-chart-page-${page}.xlsx`);
}

export function getFilmsExportRowCount(characters: Character[]) {
  return characters.filter((c) => c.films.length > 0).length;
}
