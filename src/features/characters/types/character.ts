export interface Character {
  _id: number;
  imageUrl: string;
  name: string;
  tvShows: string[];
  videoGames: string[];
  allies: string[];
  enemies: string[];
  films: string[];
}

export interface CharactersInfo {
  totalPages: number;
  count: number;
  previousPage: string | null;
  nextPage: string | null;
}

export interface CharactersResponse {
  info: CharactersInfo;
  data: Character[];
}

export interface CharacterResponse {
  info: {
    count: number;
  };
  data: Character;
}

export interface CharactersState {
  page: number;
  pageSize: number;
  selectedCharacter: Character | null;
  searchQuery: string;
  tvShowFilter: string;
}
