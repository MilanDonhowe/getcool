/*
  Filename: find.ts
  Info: find  nearest location in an array.
*/
import { Coordinates, Location } from "../types";

export const difference = (origin: Coordinates, place: Coordinates) => {
  // Sphere Math from https://www.movable-type.co.uk/scripts/latlong.html
  const R = 6371e3; // metres
  const φ1 = origin.latitude * Math.PI/180; // φ, λ in radians
  const φ2 = place.latitude * Math.PI/180;
  
  const Δφ = (place.latitude - origin.latitude) * Math.PI/180;
  const Δλ = (place.longitude - origin.longitude) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // in metres
  // Convert "metres" to miles
  return d //* 0.000621371 // use constant to get miles
}

export const nearest = (origin: Coordinates, locations: Location[]) => {
  let nearestLocation = locations[0];
  let nearestDistance = difference(origin, nearestLocation.coords);
  for (let i = 1; i < locations.length; i++){
    const distance = difference(origin, locations[i].coords);
    if (distance < nearestDistance){
      nearestDistance = distance;
      nearestLocation = locations[i];
    }
  }
  return nearestLocation;
}