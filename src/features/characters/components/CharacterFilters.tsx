import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Grid,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAppDispatch, useAppSelector } from "../../../app/hooks/hooks";
import { setSearchQuery, setTvShowFilter } from "../charactersSlice";
import { useGetTvShowOptionsQuery } from "../charactersApi";

const CharacterFilters = () => {
  const dispatch = useAppDispatch();
  const { searchQuery, tvShowFilter } = useAppSelector(
    (state) => state.characters,
  );
  const {
    data: tvShowOptions = [],
    isLoading: tvShowsLoading,
    isError: tvShowsError,
  } = useGetTvShowOptionsQuery();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localTvShow, setLocalTvShow] = useState(tvShowFilter);

  const handleApply = () => {
    dispatch(setSearchQuery(localSearch));
    dispatch(setTvShowFilter(localTvShow));
  };

  const handleClear = () => {
    setLocalSearch("");
    setLocalTvShow("");
    dispatch(setSearchQuery(""));
    dispatch(setTvShowFilter(""));
  };

  const hasActiveFilters = searchQuery !== "" || tvShowFilter !== "";

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        gap: 2,
        px: 3,
        py: 4,
        backgroundColor: "white",
        border: "1px solid #e5e5e5",
        borderRadius: 6,
      }}
    >
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography
          variant="caption"
          component="div"
          sx={{ display: "block", mb: 0.5 }}
        >
          Search character
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Filter by character name..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Typography
          variant="caption"
          component="div"
          sx={{ display: "block", mb: 0.5 }}
        >
          Filter by TV show
        </Typography>
        <Box sx={{ position: "relative" }}>
          <Autocomplete
            fullWidth
            size="small"
            options={tvShowOptions}
            value={localTvShow || null}
            onChange={(_, newValue) => setLocalTvShow(newValue ?? "")}
            loading={tvShowsLoading}
            isOptionEqualToValue={(a, b) => a === b}
            getOptionLabel={(o) => o}
            loadingText="Loading TV shows…"
            noOptionsText={
              tvShowsError
                ? "Could not load TV show list"
                : "No matching TV show"
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="All TV shows"
                error={tvShowsError}
              />
            )}
          />
          {tvShowsError && (
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 0.5,
                minHeight: 24,
                width: "100%",
              }}
            >
              <Typography component="span" variant="caption" color="error">
                Could not load TV show list. Try again later.
              </Typography>
            </Box>
          )}
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Button variant="contained" onClick={handleApply}>
          Apply
        </Button>
        {hasActiveFilters && (
          <Button variant="text" sx={{ ml: 2 }} onClick={handleClear}>
            Clear
          </Button>
        )}
      </Grid>
    </Box>
  );
};

export default CharacterFilters;
