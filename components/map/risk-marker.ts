import L from "leaflet";
import type { Operation } from "@/lib/schemas/operation";
import { getRiskBracket } from "@/lib/risk";

/** Ícone do marcador: halo no chão, haste branca e cabeça colorida com a nota. */
export function createRiskMarkerIcon(operation: Operation, selected: boolean): L.DivIcon {
  const bracket = getRiskBracket(operation.fixedRiskScore);
  const isHigh = bracket.level === "high";

  const html = `
    <div class="farm-pin farm-pin--${bracket.level}${selected ? " is-selected" : ""}">
      ${isHigh ? '<span class="farm-pin__pulse"></span>' : ""}
      <span class="farm-pin__halo"></span>
      <span class="farm-pin__stem"></span>
      <span class="farm-pin__head" style="background-color:${bracket.hex}">${operation.fixedRiskScore}</span>
    </div>
  `;

  return L.divIcon({
    html,
    className: "",
    iconSize: [44, 64],
    iconAnchor: [22, 56],
    tooltipAnchor: [0, -58],
  });
}
