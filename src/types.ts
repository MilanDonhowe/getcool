/*
  Filename: types.ts
  Info: Types
*/

export type Coordinates = {
  longitude: number;
  latitude: number;
};

export type Location = {
  coords: Coordinates;
  name: string;
  placeid: string;
};


