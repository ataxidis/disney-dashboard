import { configureStore } from "@reduxjs/toolkit";
import { charactersApi } from "../features/characters/charactersApi";
import charactersReducer from "../features/characters/charactersSlice";

export const store = configureStore({
  reducer: {
    characters: charactersReducer,
    [charactersApi.reducerPath]: charactersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(charactersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
