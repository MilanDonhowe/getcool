// Hit Google Maps
import { Location } from "../types";
// use Maps URLs https://developers.google.com/maps/documentation/urls/get-started
export const getDirections = async (locat: Location) => {
  // Open directions to location
  const destination_place_id = locat.placeid;
  const destination = encodeURIComponent(locat.name);
  const apiURL = `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${destination_place_id}`;
  window.open(apiURL);
}
