import { MAP_LAYERS } from "@/config/map-config";

export const TILE_SIZE = 256;

/** Converte lat/lng em coordenada de tile (fracionária) no padrão Web Mercator. */
export function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = 2 ** zoom;
  const x = ((lng + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return { x, y };
}

/** URL de um tile de satélite (Esri World Imagery). */
export function satelliteTileUrl(zoom: number, x: number, y: number): string {
  const n = 2 ** zoom;
  const wrappedX = ((x % n) + n) % n;
  return MAP_LAYERS.satellite.url
    .replace("{z}", String(zoom))
    .replace("{y}", String(y))
    .replace("{x}", String(wrappedX));
}
