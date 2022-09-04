import { 
  Container, 
  Alert, 
  Button, 
  CircularProgress,
  Box,
  Typography
} from "@mui/material";
import { Location } from "./types";
import { useState } from "react";
import { nearest } from "./geo/find";
import { getDirections } from "./geo/api";

const WIDTH = 300;

// Yeeted from Material UI Docs
function CircularProgressWithLabel(
  props: { value: string },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        thickness={.9}
        size={WIDTH} 
        sx={{}}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="p"
          color="text.secondary"
        >{props.value}</Typography>
      </Box>
    </Box>
  );
}


function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMsg, setLoadingMsg] = useState<string>("");
  const [warning, setWarning] = useState<undefined | string>(undefined);

  const getLocation = () => {
    if (loading) return;
    setLoading(true);
    setWarning(undefined);
    setLoadingMsg("Grabbing geolocation...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoadingMsg("Loading cooling center locations...");
        fetch("/data/locations.csv")
          .then((res) =>
            res.text().then((text) => {
              // Parse CSV
              const locations: Location[] = [];
              const lines = text.split("\n");
              for (let line of lines.slice(1)) {
                const nameParse = line.split('"');
                const parameters = nameParse[2].split(",");
                locations.push({
                  coords: {
                    latitude: Number(parameters[2]),
                    longitude: Number(parameters[3]),
                  },
                  name: nameParse[1],
                  placeid: parameters[1],
                });
              }
              setLoadingMsg("Finding closest cooling center...");
              // Find nearest center (approximate)
              const nearestLocation = nearest(position.coords, locations);
              // Open Google Maps with the directions
              getDirections(nearestLocation);
              setLoading(false);
            })
          )
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      },
      (error) => {
        // code = 1 means user refused to enable location services.
        setLoading(false);
        if (error.code === 1) {
          setWarning(
            "Geolocation services need to be allowed to locate the nearest cooling center."
          );
        }
      }
    );
  };

  return (
    <div>
      {warning && <Alert severity="error">{warning}</Alert>}
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 400,
        }}>
        {!loading && (
          <Button
            variant="contained"
            sx={{
              width: WIDTH,
              height: WIDTH,
              borderRadius: 100,
            }}
            onClick={getLocation}>
            <h1>Get cool</h1>
          </Button>
        )}
        {loading && (
          <CircularProgressWithLabel value={loadingMsg} />
        )}
      </Container>
    </div>
  );
}

export default App;
