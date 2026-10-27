import { SATELLITE_SOURCE_NOTE } from "@/config/map-config";
import { cn } from "@/lib/utils";
import { SatelliteView } from "./satellite-view";

interface FarmGalleryProps {
  latitude: number;
  longitude: number;
  className?: string;
}

/** Grade de 3 imagens como na referência: uma alta à esquerda e duas empilhadas. */
export function FarmGallery({ latitude, longitude, className }: FarmGalleryProps) {
  return (
    <figure className="space-y-1.5">
      <div className={cn("grid h-[210px] grid-cols-2 grid-rows-2 gap-2", className)}>
        <SatelliteView
          latitude={latitude}
          longitude={longitude}
          zoom={15}
          label="Propriedade"
          className="row-span-2 rounded-2xl"
        />
        <SatelliteView
          latitude={latitude}
          longitude={longitude}
          zoom={12}
          label="Região"
          className="rounded-2xl"
        />
        <SatelliteView
          latitude={latitude}
          longitude={longitude}
          zoom={17}
          label="Detalhe"
          className="rounded-2xl"
        />
      </div>
      <figcaption className="text-[10px] text-zinc-400">{SATELLITE_SOURCE_NOTE}</figcaption>
    </figure>
  );
}
