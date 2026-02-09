#!/bin/bash

# =========================
# CONFIGURAÇÕES
# =========================
DOWNLOADS="$HOME/Downloads"
REPO="/Users/tmcnet/Desenvolvimento/git/tesouro-direto-dados"
DESTINO="$REPO/precos"
LOGDIR="$REPO/log"
LOGFILE="$LOGDIR/atualizar_td.log"

ARQUIVO="rendimento-resgatar.csv"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

# =========================
# INÍCIO
# =========================
echo "[$TIMESTAMP] Início da atualização Tesouro Direto" >> "$LOGFILE"

# Verifica se o arquivo existe
if [ ! -f "$DOWNLOADS/$ARQUIVO" ]; then
  echo "[$TIMESTAMP] ERRO: Arquivo $ARQUIVO não encontrado em Downloads" >> "$LOGFILE"
  exit 1
fi

# Copia o arquivo
cp "$DOWNLOADS/$ARQUIVO" "$DESTINO/$ARQUIVO"
if [ $? -ne 0 ]; then
  echo "[$TIMESTAMP] ERRO: Falha ao copiar arquivo para o repositório" >> "$LOGFILE"
  exit 1
fi

echo "[$TIMESTAMP] Arquivo copiado com sucesso para o repositório" >> "$LOGFILE"

# Remove o arquivo do Downloads
rm "$DOWNLOADS/$ARQUIVO"
if [ $? -ne 0 ]; then
  echo "[$TIMESTAMP] ATENÇÃO: Não foi possível remover o arquivo do Downloads" >> "$LOGFILE"
else
  echo "[$TIMESTAMP] Arquivo removido do Downloads com sucesso" >> "$LOGFILE"
fi

# =========================
# GIT
# =========================
cd "$REPO" || exit 1

git add "precos/$ARQUIVO" "log/atualizar_td.log"

git commit -m "Atualização Tesouro Direto (resgate) - $TIMESTAMP" >> "$LOGFILE" 2>&1
git push >> "$LOGFILE" 2>&1

if [ $? -eq 0 ]; then
  echo "[$TIMESTAMP] Git push executado com sucesso" >> "$LOGFILE"
else
  echo "[$TIMESTAMP] ERRO: Falha no git push" >> "$LOGFILE"
  exit 1
fi

echo "[$TIMESTAMP] Fim da execução" >> "$LOGFILE"
echo "----------------------------------------" >> "$LOGFILE"