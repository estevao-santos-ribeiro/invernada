# Campora — Visão Geral do Projeto

Painel web desenvolvido para cooperativa de crédito (**Sicredi**) para acompanhamento, explicação e simulação de risco em financiamentos pecuários.

---

## 1. Proposta de Valor
Diferente de sistemas convencionais de crédito que apenas geram um score numérico sem contexto, o diferencial do **Campora** é:
- **Explicar o motivo da nota** em linguagem simples e compreensível para o analista e tomador de decisão (ex: *"choveu pouco na região, o vigor do pasto reduziu e o custo da ração subiu"*).
- **Simulador "E se?"**: permitir simular cenários adversos (ex: precipitação 30% abaixo do normal, ração +20%) e observar imediatamente o impacto na nota.
- **Georreferenciamento e Satélite**: cruzamento de coordenadas reais de fazendas com satélite (Copernicus/Sentinel-2) e clima (Open-Meteo e NASA POWER).

---

## 2. Regras Fundamentais do Projeto
1. **Confiabilidade de dados**: Nunca inventar dados climáticos, de satélite ou de custos. As operações desta primeira etapa são simuladas e claramente identificadas como tal (`isSimulated: true`).
2. **Nota ilustrativa calibrada em configuração**: Os pesos dos pilares e faixas de cores ficam centralizados exclusivamente no arquivo `config/risk-config.ts`.
3. **Idioma**: Interface em Português do Brasil (pt-BR); código, nomes de variáveis e commits em inglês.
4. **Segurança de credenciais**: Chaves de API externas (Copernicus/Sentinel Hub) operam estritamente no servidor via rotas internas (`Route Handlers`), nunca expostas no navegador.
5. **Clareza antes de beleza**: Mapas e listas priorizam leitura rápida e tomada de decisão por analistas da cooperativa.
6. **Validação rigorosa**: Todas as estruturas de dados são validadas com schemas Zod.

---

## 3. Modelo da Nota de Risco (0 a 100)
A nota varia de **0 a 100**, onde maior significa **maior risco**.

### Faixas de Risco (`config/risk-config.ts`):
- **0 a 33**: Baixo Risco (Verde)
- **34 a 66**: Risco Moderado (Amarelo)
- **67 a 100**: Alto Risco (Vermelho - Marcadores com animação pulsante)

### Os Três Pilares (Soma = 1.0):
1. **Clima (Peso: 0.40)**: Chuva e temperatura comparadas com o normal histórico da região.
2. **Pasto / Vegetação (Peso: 0.35)**: Índice NDVI extraído de imagens de satélite.
3. **Custos (Peso: 0.25)**: Custo da alimentação e suplementação do rebanho.

---

## 4. Telas do Sistema
Todas as telas ficam dentro de uma moldura branca sobre fundo escuro, com uma barra de ícones à esquerda: Mapa, Operações, Clima, Simulador e Sobre, e no rodapé Configurações e Sair. No celular, a barra fica embaixo e mostra só os 5 itens principais.

- **Mapa (`/`)**:
  - Mapa de satélite em tela cheia (alternável para OpenStreetMap), com fonte citada.
  - Filtros em pílulas no topo: rebanho, faixa de risco, município e tendência.
  - Marcadores com halo no chão, coloridos pela nota; os vermelhos pulsam.
  - Ao clicar, abre um tooltip translúcido sobre o marcador (nota, variação, rebanho) e o cartão da fazenda à esquerda: 3 recortes reais de satélite com fonte, nome, município, descrição, métricas, mini-gráfico de 6 meses, etiquetas, valor financiado e botão "Ver detalhes".
- **Operações (`/operacoes`)**:
  - Resumo da carteira (total, alto, moderado, baixo risco).
  - Lista ordenada pela nota (maior risco primeiro), com bolinha colorida, busca e os mesmos filtros do mapa.
- **Detalhe da operação (`/operacoes/[id]`)**:
  - Cartão da fazenda com imagens, métricas e etiquetas.
  - Gráfico de evolução da nota nos últimos 6 meses.
  - Espaço "Por que a nota mudou", com os sinais das Etapas 2, 3 e 4.
- **Sobre (`/sobre`)**: pesos e faixas da nota (lidos da configuração) e fontes de dados.
- **Telas provisórias**: `/clima`, `/simulador`, `/configuracoes` e `/sair` mostram por enquanto só o título centralizado.
