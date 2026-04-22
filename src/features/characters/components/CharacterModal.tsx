import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import { useAppDispatch, useAppSelector } from "../../../app/hooks/hooks";
import { setSelectedCharacter } from "../charactersSlice";

type CharacterModalImageProps = {
  name: string;
  imageUrl: string;
};

const CharacterModalImage = ({ name, imageUrl }: CharacterModalImageProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        backgroundColor: "#ccc",
        borderRadius: "8px 8px 0 0",
      }}
    >
      {loadError ? (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            px: 2,
            borderRadius: "8px 8px 0 0",
            bgcolor: "action.hover",
            color: "text.secondary",
          }}
        >
          <BrokenImageOutlinedIcon sx={{ fontSize: 40 }} aria-hidden />
          <Typography
            variant="body2"
            component="p"
            sx={{ textAlign: "center", m: 0 }}
          >
            Error loading image
          </Typography>
        </Box>
      ) : (
        <>
          {imageLoading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px 8px 0 0",
                bgcolor: "rgba(0, 0, 0, 0.2)",
              }}
            >
              <CircularProgress size={40} sx={{ color: "white" }} />
            </Box>
          )}
          <Box
            component="img"
            ref={(el: HTMLImageElement | null) => {
              if (el?.complete && el.naturalWidth > 0) setImageLoading(false);
            }}
            src={imageUrl}
            alt={name}
            onLoad={() => {
              setImageLoading(false);
              setLoadError(false);
            }}
            onError={() => {
              setImageLoading(false);
              setLoadError(true);
            }}
            sx={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: "cover",
              borderRadius: "8px 8px 0 0",
            }}
          />
        </>
      )}
    </Box>
  );
};

const CharacterModal = () => {
  const dispatch = useAppDispatch();
  const selectedCharacter = useAppSelector(
    (state) => state.characters.selectedCharacter,
  );

  const isOpen = !!selectedCharacter;

  const handleClose = () => dispatch(setSelectedCharacter(null));

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          maxHeight: "80vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        {selectedCharacter && (
          <>
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: "#1976d2",
                color: "white",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <CharacterModalImage
                key={`${selectedCharacter._id}-${selectedCharacter.imageUrl}`}
                name={selectedCharacter.name}
                imageUrl={selectedCharacter.imageUrl}
              />

              <Box
                sx={{
                  position: "absolute",
                  bottom: "1rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {selectedCharacter.name}
                </Typography>
              </Box>

              <IconButton
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: "1rem",
                  top: "1rem",
                  ml: "auto",
                  color: "white",
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider />

            <Box
              sx={{
                p: 3,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 3,
              }}
            >
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <DesktopWindowsIcon color="primary" />
                  <Typography
                    variant="overline"
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                  >
                    TV Shows
                  </Typography>
                </Box>
                {selectedCharacter.tvShows.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    None
                  </Typography>
                ) : (
                  <List dense disablePadding>
                    {selectedCharacter.tvShows.map((show) => (
                      <ListItem key={show} disableGutters>
                        <ListItemText primary={show} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>

              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SportsEsportsIcon color="primary" />
                  <Typography
                    variant="overline"
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                  >
                    Video Games
                  </Typography>
                </Box>

                {selectedCharacter.videoGames.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    None
                  </Typography>
                ) : (
                  <List dense disablePadding>
                    {selectedCharacter.videoGames.map((game) => (
                      <ListItem key={game} disableGutters>
                        <ListItemText primary={game} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default CharacterModal;
