# Campora — Estrutura Técnica e Guia de Execução

Documentação técnica sobre a arquitetura de arquivos, dependências e fluxo de execução do projeto Campora.

---

## 1. Stack Tecnológica
- **Framework**: Next.js 16 (App Router, Cache Components) + TypeScript
- **Estilização**: Tailwind CSS v4 + Radix UI Primitives (Popover, Tabs, Slot)
- **Mapa**: Leaflet + React-Leaflet (dynamic import sem SSR)
- **Gráficos**: Recharts
- **Animações e Ícones**: Motion (`motion/react`), Lucide React
- **Validação e Formulários**: Zod, React Hook Form, @hookform/resolvers
- **Estado e Fetching**: TanStack React Query (instalado, uso a partir da Etapa 2)

---

## 2. Arquitetura de Pastas

```
campora/
├── app/
│   ├── globals.css                # Tailwind, Leaflet, marcadores com halo, tooltip translúcido
│   ├── layout.tsx                 # Layout raiz (html/body, fonte Geist, metadados pt-BR)
│   └── (painel)/                  # Grupo de rotas que compartilha a moldura (não aparece na URL)
│       ├── layout.tsx             # AppShell: fundo escuro, moldura branca, barra de ícones
│       ├── page.tsx               # "/" Mapa em tela cheia + filtros + cartão da fazenda
│       ├── operacoes/
│       │   ├── page.tsx           # "/operacoes" Lista ordenada por risco
│       │   └── [id]/page.tsx      # "/operacoes/[id]" Detalhe da operação
│       └── sobre/page.tsx         # "/sobre" Modelo da nota e fontes de dados
├── components/
│   ├── shell/                     # app-shell.tsx (moldura, PageSurface), sidebar.tsx (desktop e celular)
│   ├── map/
│   │   ├── map-explorer.tsx       # Estado da tela do mapa: filtros, seleção, camada, cartão
│   │   ├── risk-map.tsx           # MapContainer, tiles, marcadores, tooltip, enquadramento
│   │   ├── risk-marker.ts         # divIcon: halo no chão + haste + nota (vermelhos pulsam)
│   │   └── map-tooltip.tsx        # Conteúdo do tooltip translúcido
│   ├── farm/
│   │   ├── farm-card.tsx          # Cartão flutuante (painel inferior no celular)
│   │   ├── farm-details.tsx       # Blocos reutilizados: título, descrição, métricas, etiquetas, valor
│   │   ├── farm-gallery.tsx       # Grade de 3 recortes de satélite
│   │   ├── satellite-view.tsx     # Recorte real de satélite centralizado na coordenada
│   │   ├── stat-tile.tsx          # Cartão de métrica
│   │   └── tag-chip.tsx           # Etiqueta em pílula
│   ├── filters/                   # filter-bar.tsx, filter-pill.tsx (Popover, seleção múltipla)
│   ├── operations/                # operations-browser.tsx (lista), risk-trend-chart.tsx
│   └── ui/                        # Componentes base (button, badge, card, tabs)
├── config/
│   ├── risk-config.ts             # Faixas de risco, pesos dos sinais, limiar de tendência
│   └── map-config.ts              # Camadas de mapa (satélite Esri, OSM), atribuições, zoom de foco
├── data/
│   └── operations.json            # 10 operações simuladas (coordenadas provisórias no RS)
├── docs/                          # visao-geral.md, estrutura.md
└── lib/
    ├── filters.ts                 # Filtragem pura (rebanho, faixa, município, tendência)
    ├── formatters.ts              # Moeda (completa e resumida), números
    ├── operations.ts              # Carga do JSON validada com Zod, consultas e resumo
    ├── risk.ts                    # Faixa, cor, rótulo e tendência da nota
    ├── satellite.ts               # Conversão lat/lng → tile e URL do tile de satélite
    ├── utils.ts                   # cn (clsx + tailwind-merge)
    └── schemas/operation.ts       # Schema Zod da operação
```

---

## 3. Como Rodar o Projeto Localmente

### Pré-requisitos
- Node.js 20+
- npm

### Instalação
```bash
npm install --legacy-peer-deps
```
> `--legacy-peer-deps` é necessário por um conflito de peer dependency opcional do `@hookform/resolvers` com o pacote `effect`.

### Desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:3000`.

### Lint e build
```bash
npm run lint
npm run build
```

---

## 4. Decisões Arquiteturais
1. **Grupo de rotas `(painel)`**: todas as telas compartilham a moldura e a barra de ícones sem afetar as URLs.
2. **Mapa só no cliente**: `risk-map.tsx` é carregado com `next/dynamic` e `{ ssr: false }` dentro de `map-explorer.tsx` (Client Component), evitando erros de `window` e de hidratação.
3. **Marcadores com `L.divIcon`**: HTML + CSS para cor dinâmica, halo no chão e pulso nos vermelhos. Respeita `prefers-reduced-motion`.
4. **Recortes de satélite reais**: `SatelliteView` monta uma grade 3x3 de tiles da Esri World Imagery centralizada na coordenada. Não há imagem inventada; a fonte é citada e a ausência de data é informada (Regra 1). Na Etapa 3 será substituída pela imagem datada do Sentinel-2.
5. **Rotas estáticas**: `/operacoes/[id]` usa `generateStaticParams`, compatível com Cache Components.
6. **Configuração única**: faixas, pesos e limiar de tendência em `config/risk-config.ts`; camadas e atribuições em `config/map-config.ts`.
