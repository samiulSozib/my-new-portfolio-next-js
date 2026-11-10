import type { Trip } from "@frontend/lib/types";

// Countries are counted by their English name so each country is counted once.
export const countriesVisited = (trips: Trip[]) =>
  new Set(trips.map((trip) => trip.country.en)).size;
