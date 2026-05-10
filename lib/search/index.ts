export function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("en-IN");
}

export function tokenizeSearchText(value: string) {
  return normalizeSearchText(value)
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);
}

export async function searchWisdom(query: string) {
  const { getSearchAdapter } = await import("./adapters");
  return getSearchAdapter().search(query);
}
