import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Character, CharactersState } from "./types/character";

const initialState: CharactersState = {
  page: 1,
  pageSize: 50,
  searchQuery: "",
  tvShowFilter: "",
  selectedCharacter: null,
};

const charactersSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.page = 1; // reset to first page when page size changes
    },
    setSelectedCharacter(state, action: PayloadAction<Character | null>) {
      console.log("action.payload: ", action.payload);

      state.selectedCharacter = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.page = 1; // reset to first page on new search
    },
    setTvShowFilter(state, action: PayloadAction<string>) {
      state.tvShowFilter = action.payload;
      state.page = 1;
    },
  },
});

export const {
  setPage,
  setPageSize,
  setSelectedCharacter,
  setSearchQuery,
  setTvShowFilter,
} = charactersSlice.actions;

export default charactersSlice.reducer;
