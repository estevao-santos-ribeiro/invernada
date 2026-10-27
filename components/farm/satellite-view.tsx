import { cn } from "@/lib/utils";
import { latLngToTile, satelliteTileUrl, TILE_SIZE } from "@/lib/satellite";

interface SatelliteViewProps {
  latitude: number;
  longitude: number;
  zoom: number;
  className?: string;
  /** Rótulo curto exibido no canto da imagem. */
  label?: string;
  /** Mostra um ponto no local exato da coordenada. */
  showCenter?: boolean;
}

/**
 * Recorte real de satélite (Esri World Imagery) centralizado na coordenada da fazenda.
 * Monta uma grade 3x3 de tiles e desloca para que o ponto fique no centro do quadro.
 */
export function SatelliteView({
  latitude,
  longitude,
  zoom,
  className,
  label,
  showCenter = true,
}: SatelliteViewProps) {
  const { x, y } = latLngToTile(latitude, longitude, zoom);
  const tileX = Math.floor(x);
  const tileY = Math.floor(y);
  const offsetX = (x - tileX) * TILE_SIZE;
  const offsetY = (y - tileY) * TILE_SIZE;

  const tiles: { key: string; left: number; top: number; url: string }[] = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      tiles.push({
        key: `${dx}:${dy}`,
        left: (dx + 1) * TILE_SIZE,
        top: (dy + 1) * TILE_SIZE,
        url: satelliteTileUrl(zoom, tileX + dx, tileY + dy),
      });
    }
  }

  return (
    <div
      role="img"
      aria-label={`Imagem de satélite da coordenada ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
      className={cn("relative overflow-hidden bg-zinc-300", className)}
    >
      <div
        className="absolute"
        style={{
          width: TILE_SIZE * 3,
          height: TILE_SIZE * 3,
          left: `calc(50% - ${TILE_SIZE + offsetX}px)`,
          top: `calc(50% - ${TILE_SIZE + offsetY}px)`,
        }}
      >
        {tiles.map((tile) => (
          <div
            key={tile.key}
            className="absolute bg-cover"
            style={{
              left: tile.left,
              top: tile.top,
              width: TILE_SIZE,
              height: TILE_SIZE,
              backgroundImage: `url(${tile.url})`,
            }}
          />
        ))}
      </div>

      {showCenter && (
        <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-zinc-950/70 shadow" />
      )}

      {label && (
        <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          {label}
        </span>
      )}
    </div>
  );
}
