import { MapExplorer } from "@/components/map/map-explorer";
import { getOperationsSortedByRisk } from "@/lib/operations";

export default function MapaPage() {
  const operations = getOperationsSortedByRisk();
  return (
    <>
      <h1 className="sr-only">Mapa de risco das operações de pecuária</h1>
      <MapExplorer operations={operations} />
    </>
  );
}
