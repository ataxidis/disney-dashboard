import { useMemo, useState } from "react";
import {
  Box,
  TableContainer,
  TableCell,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Button,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  TableSortLabel,
} from "@mui/material";

import { useGetCharactersQuery } from "../charactersApi";
import { useAppDispatch, useAppSelector } from "../../../app/hooks/hooks";
import { setPage, setPageSize, setSelectedCharacter } from "../charactersSlice";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const CharactersTable = () => {
  const dispatch = useAppDispatch();
  const { page, pageSize, searchQuery, tvShowFilter } = useAppSelector(
    (state) => state.characters,
  );
  const { data, isLoading, isFetching, isError } = useGetCharactersQuery({
    page,
    pageSize,
    searchQuery,
    tvShowFilter,
  });

  const [nameSort, setNameSort] = useState<"asc" | "desc">("asc");

  const characters = useMemo(
    () => (Array.isArray(data?.data) ? data.data : []),
    [data],
  );

  const sortedCharacters = useMemo(() => {
    if (characters.length === 0) return characters;
    const list = [...characters];
    list.sort(
      (a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }) *
        (nameSort === "asc" ? 1 : -1),
    );
    return list;
  }, [characters, nameSort]);

  const totalPages = data?.info.totalPages ?? 0;
  const hasNextPage = !!data?.info.nextPage;
  const hasPrevPage = !!data?.info.previousPage;
  const hasNoResults = characters.length === 0;
  const isTableBodyLoading = isLoading || isFetching;
  const isTableFooterDisabled = isTableBodyLoading || isError;

  return (
    <Box
      sx={{
        backgroundColor: "white",
        border: "1px solid #e5e5e5",
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      <TableContainer
        sx={{
          maxHeight: { xs: "50vh", sm: "min(60vh, 28rem)" },
        }}
      >
        <Table stickyHeader>
          <TableHead
            sx={{
              textTransform: "uppercase",
              "& .MuiTableCell-head": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <TableRow>
              <TableCell sortDirection={nameSort}>
                <TableSortLabel
                  active
                  direction={nameSort}
                  onClick={() =>
                    setNameSort((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>TV Shows</TableCell>
              <TableCell>Video Games</TableCell>
              <TableCell>Allies</TableCell>
              <TableCell>Enemies</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ py: 6, borderBottom: "none" }}
                >
                  <Typography color="error">
                    Failed to load characters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : isTableBodyLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ py: 6, borderBottom: "none" }}
                >
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : hasNoResults ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{
                    py: 5,
                    color: "text.secondary",
                    borderBottom: "none",
                  }}
                >
                  <Typography variant="body1">No results</Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedCharacters.map((character) => (
                <TableRow
                  key={character._id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => dispatch(setSelectedCharacter(character))}
                >
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {character.name}
                  </TableCell>
                  <TableCell>{character.tvShows.length}</TableCell>
                  <TableCell>{character.videoGames.length}</TableCell>
                  <TableCell>
                    {character.allies.length > 0
                      ? character.allies.join(", ")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {character.enemies.length > 0
                      ? character.enemies.join(", ")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          px: 2,
          py: 2,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          borderTop: "1px solid #e5e5e5",
          backgroundColor: "#fafafa",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              component="span"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Rows per page
            </Typography>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 88 }}>
              <Select
                value={pageSize}
                onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
                displayEmpty
                disabled={isTableFooterDisabled}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={200}>200</MenuItem>
                <MenuItem value={500}>500</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginLeft: { xs: 0, sm: "auto" },
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            {page} of {totalPages}
          </Typography>
          <Button
            sx={{ borderRadius: "2rem", padding: "0.75rem 0" }}
            disabled={!hasPrevPage || isTableFooterDisabled}
            onClick={() => dispatch(setPage(page - 1))}
          >
            <ArrowBackIosIcon />
          </Button>
          <Button
            sx={{ borderRadius: "2rem", padding: "0.75rem 0" }}
            disabled={!hasNextPage || isTableFooterDisabled}
            onClick={() => dispatch(setPage(page + 1))}
          >
            <ArrowForwardIosIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CharactersTable;
