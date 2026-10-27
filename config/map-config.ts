/**
 * Camadas de mapa de fundo usadas no painel.
 *
 * Só tiles são carregados de fora (permitido no Passo 1). Ambos os provedores
 * dispensam chave de API e exigem atribuição visível, que é exibida no mapa.
 */

export type MapLayerId = "satellite" | "streets";

export interface MapLayer {
  id: MapLayerId;
  label: string;
  url: string;
  attribution: string;
  maxZoom: number;
}

export const MAP_LAYERS: Record<MapLayerId, MapLayer> = {
  satellite: {
    id: "satellite",
    label: "Satélite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      'Imagens &copy; <a href="https://www.esri.com" target="_blank" rel="noopener noreferrer">Esri</a>, Maxar, Earthstar Geographics',
    maxZoom: 18,
  },
  streets: {
    id: "streets",
    label: "Mapa",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
    maxZoom: 19,
  },
};

export const DEFAULT_MAP_LAYER: MapLayerId = "satellite";

/** Legenda exibida junto às imagens de satélite (Regra 1: sempre citar fonte e data). */
export const SATELLITE_SOURCE_NOTE =
  "Esri World Imagery · data da imagem não informada pelo provedor";

/** Zoom usado ao focar uma fazenda selecionada. */
export const FOCUS_ZOOM = 13;
