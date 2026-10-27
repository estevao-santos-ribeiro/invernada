# Campora — Estrutura Técnica e Guia de Execução

Documentação técnica sobre a arquitetura de arquivos, dependências e fluxo de execução do projeto Campora (**UNIPLAC / Integrativa SI 2026.2 — Desafio 1**).

---

## 1. Stack Tecnológica
- **Framework**: Next.js 16 (App Router, Cache Components) + TypeScript
- **Estilização**: Tailwind CSS v4 + Radix UI Primitives (Popover, Tabs, Slot)
- **Mapa**: Leaflet + React-Leaflet (dynamic import sem SSR, controle de remount de panes)
- **Gráficos e Visualizações**: Recharts (evolução da safra) + SVG Dinâmico (Waterfall de decomposição do risco)
- **Animações e Ícones**: Motion (`motion/react`), Lucide React
- **Validação e Tipagem**: Zod (validação de schemas de operações e séries históricas)
- **Estado e Motores**: Motor matemático próprio (`lib/indicator.ts`) para cálculo das 4 variáveis e decomposição

---

## 2. Arquitetura de Pastas

```
campora/
├── app/
│   ├── globals.css                # Tailwind, Leaflet, marcadores com halo, tooltip translúcido
│   ├── layout.tsx                 # Layout raiz (html/body, fonte Geist, metadados pt-BR)
│   └── (painel)/                  # Grupo de rotas com moldura AppShell compartilhada
│       ├── layout.tsx             # AppShell: fundo escuro (#2b2b2b), moldura branca, sidebar/nav
│       ├── page.tsx               # "/" Mapa em tela cheia + seletor temporal + filtros + cartão
│       ├── operacoes/
│       │   ├── page.tsx           # "/operacoes" Lista ordenada por risco (< 50 primeiro)
│       │   └── [id]/page.tsx      # "/operacoes/[id]" Detalhe: Waterfall, 4 variáveis, pesagem, API
│       ├── clima/page.tsx         # "/clima" Monitor agroclimático da Serra Catarinense
│       ├── simulador/page.tsx     # "/simulador" Simulador de cenários "E se?" e pesos
│       ├── configuracoes/page.tsx # "/configuracoes" Parâmetros de crédito e sincronização CSV
│       ├── sobre/page.tsx         # "/sobre" Metodologia UNIPLAC, fontes e LGPD Art. 20
│       └── sair/page.tsx          # "/sair" Encerramento seguro de sessão
├── components/
│   ├── shell/                     # app-shell.tsx (moldura, PageSurface), sidebar.tsx
│   ├── map/
│   │   ├── map-explorer.tsx       # Estado do mapa: mês safra 2026, filtros, camada, cartão
│   │   ├── risk-map.tsx           # MapContainer, tiles, marcadores, tooltip, enquadramento
│   │   ├── risk-marker.ts         # divIcon: halo no chão + haste + nota (vermelhos pulsam)
│   │   └── map-tooltip.tsx        # Conteúdo do tooltip translúcido
│   ├── farm/
│   │   ├── farm-card.tsx          # Cartão flutuante (painel inferior no celular)
│   │   ├── farm-details.tsx       # Título, descrição, métricas, tags (inclui confiança baixa)
│   │   ├── farm-gallery.tsx       # Grade de 3 recortes de satélite
│   │   ├── satellite-view.tsx     # Recorte real de satélite centralizado na coordenada
│   │   ├── stat-tile.tsx          # Cartão de métrica
│   │   └── tag-chip.tsx           # Etiqueta em pílula
│   ├── filters/                   # filter-bar.tsx, filter-pill.tsx (faixas UNIPLAC, rebanho, município)
│   ├── operations/
│   │   ├── operations-browser.tsx # Lista com busca, seletor de mês e badges de confiança
│   │   ├── timeline-selector.tsx  # Linha do tempo Abr–Out/26 com marcos meteorológicos
│   │   ├── waterfall-chart.tsx    # Gráfico SVG de decomposição da nota desde a contratação
│   │   ├── operation-detail-client.tsx # Inteligência completa da operação e formulário de pesagem
│   │   └── risk-trend-chart.tsx   # Gráfico de linha temporal da nota
│   ├── clima/
│   │   └── climate-dashboard.tsx  # Comparativo Lages vs Serra Alta, geadas e histórico
│   ├── simulador/
│   │   └── risk-simulator.tsx     # Choques de geada/NDVI/peso/arroba e reclassificação
│   ├── configuracoes/
│   │   └── settings-dashboard.tsx # Parâmetros de cobertura, juros, Cepea e simulação CSV
│   └── ui/                        # Componentes base (button, badge, card, tabs)
├── config/
│   ├── risk-config.ts             # Brackets UNIPLAC (<50 alto, 50-69 moderado, >=70 baixo) e pesos
│   └── map-config.ts              # Camadas de mapa (satélite Esri, OSM), centro e zoom
├── data/
│   └── operations.json            # 16 operações da Serra Catarinense com série Abr–Out/26
├── docs/                          # visao-geral.md, estrutura.md
└── lib/
    ├── indicator.ts               # Motor matemático UNIPLAC (F.clima, F.pasto, F.rebanho, F.garantia, waterfall)
    ├── filters.ts                 # Filtragem pura
    ├── formatters.ts              # Moeda e números no padrão BR
    ├── operations.ts              # Loader validado por Zod, ordenação por risco e mês
    ├── risk.ts                    # Faixa de risco, rótulos, cores e direção de tendência
    ├── satellite.ts               # Conversão de coordenadas para tiles Esri
    ├── utils.ts                   # cn (clsx + tailwind-merge)
    └── schemas/operation.ts       # Schemas Zod de Operação e Histórico Mensal
```

---

## 3. Validação e Execução

### Comandos de Verificação:
```bash
npm run lint
npm run build
```
Não fazer requisições HTTP externas nem invocar agentes de browser (validação 100% autônoma via build).
