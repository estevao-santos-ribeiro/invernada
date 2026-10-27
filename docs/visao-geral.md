# Campora — Visão Geral do Projeto

Painel de inteligência de risco pecuário e garantia desenvolvido para cooperativas de crédito da Serra Catarinense (**UNIPLAC / Integrativa SI 2026.2 — Desafio 1: Pecuária de Corte**).

---

## 1. Proposta de Valor
Diferente de sistemas convencionais de crédito que apenas geram um score estático sem explicação, o **Campora** oferece:
- **Explicar o motivo da nota** em linguagem simples e compreensível para o analista e tomador de decisão (ex: *"8 geadas em junho, pasto 25% abaixo do normal, lote 14 kg abaixo do plano sazonal"*).
- **Decomposição Waterfall**: gráfico interativo mostrando a variação exata de cada variável desde a contratação (Abril) até o mês selecionado.
- **Pontos para verificar**: sugestões neutras para orientar a conversa do analista com o cooperado sem decisões automáticas restritivas (em conformidade com o Art. 20 da LGPD).
- **Simulador de pesagem rápida**: permite ao analista registrar peso informado pelo produtor com recálculo instantâneo do score.
- **Linha do tempo da safra 2026 (Abr a Out)**: com marcos meteorológicos reais observados na Serra Catarinense (21/5, 24/6 com -9,1°C, 31/8, 17/9).
- **Simulador "E se?" e Calibrador de Pesos**: permite testar choques de geada, quebra de NDVI, desvios no ganho de peso e preço da arroba.

---

## 2. Regras Fundamentais do Projeto
1. **Confiabilidade de dados**: Dados climáticos reais (INMET Lages A882 / Epagri-Ciram) e pastagem (NDVI Sentinel-2). Operações simuladas identificadas como tal (`isSimulated: true`).
2. **Auditoria e LGPD (Art. 20)**: O modelo não é caixa-preta; todas as variáveis e pesos são auditáveis e abertos via API simulada `GET /v1/operacoes/{id}/score?mes=2026-XX`.
3. **Tom estritamente neutro**: Sugestões e alertas utilizam linguagem orientativa, reconhecendo que a decisão de crédito é do analista humano.
4. **Alerta de Confiança Baixa**: Quando faltar pesagem recente, o indicador adota nota neutra (50) para o rebanho e exibe o badge "Confiança baixa".
5. **Layout e Design System**: Fundo escuro `#2b2b2b`, moldura arredondada branca, sidebar com ícones, barra inferior no celular com estritamente 5 itens principais.

---

## 3. Modelo do Indicador de Risco Pecuário (0 a 100)
A nota varia de **0 a 100**, onde:
- **≥ 70 pts**: Baixo Risco (Verde)
- **50 a 69 pts**: Risco Moderado (Amarelo)
- **< 50 pts**: Alto Risco (Vermelho - Marcadores com animação pulsante)

Ordenação de risco: menor nota / pior risco primeiro.

### As Quatro Variáveis (Pesos Calibráveis):
1. **Clima (15%)**: Geadas acima do normal e anomalias de precipitação (&lt;85% ou &gt;150%).
2. **Pastagem (15%)**: Vigor do pasto / anomalia de NDVI (Sentinel-2 / SATVeg Embrapa).
3. **Rebanho (35%)**: Desvio do ganho de peso em kg/cab vs plano sazonal da Serra Catarinense.
4. **Garantia (35%)**: Índice de cobertura = (rebanho × peso × R$/kg Cepea) / saldo devedor corrigido a 0,9% a.m. (mínimo de política: 1,30x).

---

## 4. Telas do Sistema
- **Mapa (`/`)**: Mapa em tela cheia com seletor de linha do tempo (Abril a Outubro de 2026), filtros em pílulas, marcadores coloridos com pulso no alto risco e cartão da fazenda com recortes de satélite e métricas.
- **Operações (`/operacoes`)**: Visão consolidada da carteira com busca textual, seletor de mês e lista ordenada por maior risco primeiro (&lt; 50).
- **Detalhes da Operação (`/operacoes/[id]`)**: Decomposição Waterfall, diagnóstico das 4 variáveis, pontos neutros para verificar, formulário de pesagem rápida e endpoint JSON simulado da API REST.
- **Clima (`/clima`)**: Monitor agrometeorológico da Serra Catarinense comparando Lages e Serra Alta (Urupema/Painel), histórico de geadas e linha do tempo de eventos climáticos críticos.
- **Simulador (`/simulador`)**: Painel de choques de cenário "E se?" e calibrador dinâmico de pesos com reclassificação imediata da carteira.
- **Configurações (`/configuracoes`)**: Parâmetros de política institucional de crédito, tabelas Cepea/Epagri-Cepa e simulador de sincronização CSV.
- **Sobre (`/sobre`)**: Metodologia, fontes de dados e fundamentação LGPD Art. 20.
- **Sair (`/sair`)**: Encerramento seguro de sessão com retorno ao painel.
