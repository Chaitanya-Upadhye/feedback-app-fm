const defaultSortFilters = {
  columnName: "upvotes",
  filter: { ascending: false },
};

export const queryMap: Record<
  string,
  { columnName: string; filter: { ascending?: boolean } }
> = {
  most_upvotes: { columnName: "upvotes", filter: { ascending: false } },
  least_upvotes: { columnName: "upvotes", filter: { ascending: true } },
  least_comments: { columnName: "comments", filter: { ascending: true } },
  most_comments: { columnName: "comments", filter: { ascending: false } },
};

export function mapSearchQueryToSupabaseSortQuery(searchQuery: string): {
  columnName: string;
  filter: { ascending?: boolean };
} {
  const query = searchQuery.trim();

  if (queryMap[query]) {
    return queryMap[query];
  }
  return defaultSortFilters;
}
