import { useMemo } from "react";
import Highcharts from "highcharts/esm/highcharts.src.js";
import {
  Chart,
  setHighcharts,
  type HighchartsOptionsType,
} from "@highcharts/react";
import { Box, Typography, CircularProgress, Grid, Button } from "@mui/material";
import { useGetCharactersQuery } from "../../characters/charactersApi";
import { useAppSelector } from "../../../app/hooks/hooks";
import {
  exportCurrentPageFilmsXlsx,
  getFilmsExportRowCount,
} from "../../characters/utils/exportFilmsXlsx";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

setHighcharts(Highcharts);

type FilmSlice = {
  name: string;
  y: number;
  custom: {
    films: string[];
  };
};

const FilmsChart = () => {
  const { page, pageSize, searchQuery, tvShowFilter } = useAppSelector(
    (state) => state.characters,
  );

  const { data, isLoading, isFetching, isError } = useGetCharactersQuery({
    page,
    pageSize,
    searchQuery,
    tvShowFilter,
  });

  const characterList = useMemo(() => {
    const raw = data?.data;
    return Array.isArray(raw) ? raw : [];
  }, [data?.data]);

  // Each character is slice. Value is number of films
  const seriesData = useMemo<FilmSlice[]>(
    () =>
      characterList
        .filter((character) => character.films.length > 0)
        .map((character) => ({
          name: character.name,
          y: character.films.length,
          custom: {
            films: character.films,
          },
        })),
    [characterList],
  );

  const totalFilms = seriesData.reduce(
    (sum, filmSlice) => sum + filmSlice.y,
    0,
  );

  const characters = characterList;
  const canExportFilms = getFilmsExportRowCount(characters) > 0;

  const handleExportXlsx = () => {
    void exportCurrentPageFilmsXlsx(characters, page);
  };

  const options: HighchartsOptionsType = {
    chart: {
      type: "pie",
      height: 400,
    },
    title: {
      text: undefined,
    },
    tooltip: {
      useHTML: true,
      formatter(this: Highcharts.Point) {
        const point = this as Highcharts.Point & {
          options: { custom: { films: string[] } };
        };
        const films = point.options.custom?.films ?? [];
        return `
          <div style="position: relative; z-index: 1;">
            <strong>${point.name}</strong><br/>
            <em>${point.percentage?.toFixed(1)}%</em><br/>

            <ul style="margin: 4px 0 0 0; padding-left: 16px;">
              ${films.map((f) => `<li>${f}</li>`).join("")}
            </ul>
          </div>
        `;
      },
    },
    plotOptions: {
      pie: {
        innerSize: "70%",
        dataLabels: {
          enabled: false,
        },
      },
    },
    series: [
      {
        type: "pie",
        name: "Films",
        data: seriesData,
      },
    ],
    credits: {
      enabled: false,
    },
  };

  const isChartAreaLoading = isLoading || isFetching;

  return (
    <Box
      sx={{
        backgroundColor: "white",
        border: "1px solid #e5e5e5",
        borderRadius: 6,
        px: 3,
        pt: 2,
        pb: 4,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="outlined"
          onClick={handleExportXlsx}
          disabled={!canExportFilms || isChartAreaLoading}
        >
          <FileDownloadIcon fontSize="small" color="primary" sx={{ mr: 1 }} />{" "}
          Export XLSX
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ maxHeight: "min(60vh, 28rem)" }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ position: "relative", minWidth: 280, zIndex: 0 }}>
            {isChartAreaLoading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 400,
                }}
              >
                <CircularProgress size={40} />
              </Box>
            ) : isError ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 400,
                  px: 2,
                }}
              >
                <Typography color="error" sx={{ textAlign: "center" }}>
                  Failed to load chart data.
                </Typography>
              </Box>
            ) : seriesData.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 2,
                }}
              >
                <Typography color="text.secondary" sx={{ textAlign: "center" }}>
                  No film data for current page.
                </Typography>
              </Box>
            ) : (
              <Chart options={options} />
            )}
          </Box>
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ minWidth: 0, display: { xs: "none", md: "block" } }}
        >
          <Box
            sx={{
              maxHeight: 400,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {seriesData.map((filmSlice, index) => {
              const color = Highcharts.getOptions().colors?.[
                index % 10
              ] as string;
              const percentage = ((filmSlice.y / totalFilms) * 100).toFixed(1);

              return (
                <Box
                  key={filmSlice.name}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1,
                    border: "1px solid #e5e5e5",
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: color,
                      }}
                    />
                    <Typography variant="body2">{filmSlice.name}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {percentage}%
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilmsChart;
