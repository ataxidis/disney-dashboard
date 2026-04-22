import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CharactersResponse, CharacterResponse } from "./types/character";

export type GetCharactersParams = {
  page: number;
  pageSize: number;
  searchQuery: string;
  tvShowFilter: string;
};

export const charactersApi = createApi({
  reducerPath: "charactersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.disneyapi.dev" }),
  endpoints: (builder) => ({
    getCharacters: builder.query<CharactersResponse, GetCharactersParams>({
      query: ({ page, pageSize, searchQuery, tvShowFilter }) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("pageSize", String(pageSize));
        if (searchQuery) params.set("name", searchQuery);
        if (tvShowFilter) params.set("tvShows", tvShowFilter);
        return `/character?${params.toString()}`;
      },
    }),

    // TV show names for the filter dropdown, taken from one large character page (no separate “list of shows” API).
    getTvShowOptions: builder.query<string[], void>({
      keepUnusedDataFor: 86_400,
      query: () => "/character?page=1&pageSize=1000",
      transformResponse: (res: CharactersResponse) => {
        const showNames = new Set<string>();
        for (const character of res.data ?? []) {
          for (const title of character.tvShows) {
            showNames.add(title);
          }
        }
        return [...showNames].sort((a, b) =>
          a.localeCompare(b, undefined, { sensitivity: "base" }),
        );
      },
    }),

    getCharacterById: builder.query<CharacterResponse, number>({
      query: (id) => `/character/${id}`,
    }),
  }),
});

export const {
  useGetCharactersQuery,
  useGetCharacterByIdQuery,
  useGetTvShowOptionsQuery,
} = charactersApi;
