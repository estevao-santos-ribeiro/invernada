"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import type { Operation } from "@/lib/schemas/operation";
import { FOCUS_ZOOM, MAP_LAYERS, type MapLayerId } from "@/config/map-config";
import { createRiskMarkerIcon } from "./risk-marker";
import { MapTooltipContent } from "./map-tooltip";

const DESKTOP_QUERY = "(min-width: 1024px)";
/** Largura do cartão flutuante + margens, para não esconder o marcador atrás dele. */
const CARD_OFFSET_X = 200;
const SHEET_OFFSET_Y = 150;

function MapController({
  operations,
  selected,
  focusRequest,
}: {
  operations: Operation[];
  selected?: Operation;
  focusRequest: number;
}) {
  const map = useMap();
  const didFit = useRef(false);

  // Enquadra todas as fazendas uma única vez, deixando espaço para o cartão.
  useEffect(() => {
    if (didFit.current || operations.length === 0) return;
    didFit.current = true;
    const desktop = window.matchMedia(DESKTOP_QUERY).matches;
    const bounds = L.latLngBounds(operations.map((op) => [op.latitude, op.longitude] as [number, number]));
    map.fitBounds(bounds, {
      paddingTopLeft: desktop ? [420, 90] : [24, 80],
      paddingBottomRight: desktop ? [40, 40] : [24, 280],
      maxZoom: 11,
    });
  }, [map, operations]);

  // Voa até a fazenda selecionada quando o usuário pede foco.
  useEffect(() => {
    if (focusRequest === 0 || !selected) return;
    const desktop = window.matchMedia(DESKTOP_QUERY).matches;
    const zoom = Math.max(map.getZoom(), FOCUS_ZOOM);
    const point = map.project([selected.latitude, selected.longitude], zoom);
    const offset = desktop ? L.point(-CARD_OFFSET_X, 0) : L.point(0, SHEET_OFFSET_Y);
    map.flyTo(map.unproject(point.add(offset), zoom), zoom, { duration: 1.1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só reage a novos pedidos de foco
  }, [focusRequest]);

  return null;
}

export interface RiskMapProps {
  operations: Operation[];
  selectedId?: string;
  layer: MapLayerId;
  focusRequest: number;
  onSelect: (operation: Operation) => void;
}

export default function RiskMap({ operations, selectedId, layer, focusRequest, onSelect }: RiskMapProps) {
  const tileLayer = MAP_LAYERS[layer];
  const selected = operations.find((op) => op.id === selectedId);
  const [mapKey, setMapKey] = useState(0);

  // Com Cache Components, o Next esconde a rota com <Activity> em vez de desmontar.
  // O cleanup do MapContainer chama map.remove(), mas o estado do componente fica
  // preservado apontando para o mapa destruído. Trocar a key ao esconder garante
  // um MapContainer novo quando a rota volta a ficar visível.
  useLayoutEffect(() => () => setMapKey((k) => k + 1), []);

  const icons = useMemo(() => {
    const map = new Map<string, L.DivIcon>();
    for (const op of operations) map.set(op.id, createRiskMarkerIcon(op, op.id === selectedId));
    return map;
  }, [operations, selectedId]);

  return (
    <MapContainer
      key={mapKey}
      center={[-30.7, -54.7]}
      zoom={8}
      zoomControl={false}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        key={tileLayer.id}
        url={tileLayer.url}
        attribution={tileLayer.attribution}
        maxZoom={tileLayer.maxZoom}
      />
      <ZoomControl position="bottomright" />
      <MapController operations={operations} selected={selected} focusRequest={focusRequest} />

      {operations.map((op) => (
        <Marker
          key={op.id}
          position={[op.latitude, op.longitude]}
          icon={icons.get(op.id)}
          zIndexOffset={op.id === selectedId ? 1000 : op.fixedRiskScore}
          title={`${op.farmName}, nota ${op.fixedRiskScore}`}
          eventHandlers={{ click: () => onSelect(op) }}
        >
          {op.id === selectedId && (
            <Tooltip permanent direction="top" offset={[0, -4]} className="glass-tooltip">
              <MapTooltipContent operation={op} />
            </Tooltip>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
}
