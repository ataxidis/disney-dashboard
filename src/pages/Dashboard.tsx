import { Suspense, lazy } from "react";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import CharactersTable from "../features/characters/components/CharactersTable";
import CharacterModal from "../features/characters/components/CharacterModal";
import CharacterFilters from "../features/characters/components/CharacterFilters";

const FilmsChart = lazy(
  () => import("../features/chart/components/FilmsChart"),
);

const Dashboard = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minHeight: "100vh",
        }}
      >
        <Box
          className="dashboard-header"
          sx={{
            backgroundColor: "white",
            py: 2,
            px: 4,
            flex: 1,
            maxHeight: "2.5rem",
          }}
        >
          <Typography variant="h5" className="dashboard-header__title">
            Dashboard
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }} sx={{ px: 2 }}>
            <CharacterFilters />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }} sx={{ px: 2 }}>
            <Suspense
              fallback={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 400,
                    backgroundColor: "white",
                    border: "1px solid #e5e5e5",
                    borderRadius: 6,
                  }}
                >
                  <CircularProgress size={40} />
                </Box>
              }
            >
              <FilmsChart />
            </Suspense>
          </Grid>

          <Grid size={{ xs: 12 }} sx={{ px: 2 }}>
            <CharactersTable />
          </Grid>
        </Grid>
      </Box>

      <CharacterModal />
    </>
  );
};

export default Dashboard;
