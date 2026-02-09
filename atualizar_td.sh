#!/bin/bash

DOWNLOADS="$HOME/Downloads"
REPO="/Users/tmcnet/Desenvolvimento/git/tesouro-direto-dados"
DESTINO="$REPO/precos"

INVESTIR="rendimento-investir.csv"
RESGATAR="rendimento-resgatar.csv"

# Valida existência dos arquivos
if [ ! -f "$DOWNLOADS/$INVESTIR" ]; then
  echo "Arquivo $INVESTIR não encontrado em Downloads"
  exit 1
fi

if [ ! -f "$DOWNLOADS/$RESGATAR" ]; then
  echo "Arquivo $RESGATAR não encontrado em Downloads"
  exit 1
fi

# Copia para o repositório
cp "$DOWNLOADS/$INVESTIR" "$DESTINO/$INVESTIR"
cp "$DOWNLOADS/$RESGATAR" "$DESTINO/$RESGATAR"

cd "$REPO" || exit 1

# Commit e push
git add precos/$INVESTIR precos/$RESGATAR
git commit -m "Atualização de preços Tesouro Direto"
git push

echo "✔ CSVs atualizados e enviados para o GitHub"