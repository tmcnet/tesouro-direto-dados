function atualizarTesouroDiretoSource() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = "Tesouro Direto (Source)";
  const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);

  const urlCsv = "https://raw.githubusercontent.com/tmcnet/tesouro-direto-dados/master/precos/rendimento-resgatar.csv";
  const resp = UrlFetchApp.fetch(urlCsv);
  const csv = Utilities.parseCsv(resp.getContentText(), ";");

  // Limpa e escreve CSV cru
  sheet.clear();
  sheet.getRange(1, 1, csv.length, csv[0].length).setValues(csv);

  // =========================
  // METADADOS (COLUNA F)
  // =========================

  // Labels
  sheet.getRange("F1").setValue("Data da última execução:");
  sheet.getRange("F3").setValue("Data do último commit:");

  // Valores
  const execDate = new Date();
  const commitDate = obterDataUltimoCommit();

  sheet.getRange("F2").setValue(execDate);
  sheet.getRange("F4").setValue(commitDate || "Não disponível");

  // =========================
  // FORMATAÇÃO DATA/HORA
  // =========================
  sheet.getRange("F2").setNumberFormat("dd/MM/yyyy HH:mm:ss");
  sheet.getRange("F4").setNumberFormat("dd/MM/yyyy HH:mm:ss");

  // =========================
  // COLORAÇÃO DO COMMIT
  // =========================
  aplicarIndicadorCommit(sheet.getRange("F4"), commitDate);

  protegerAbaSource();
}

/**
 * Busca a data do último commit do CSV no GitHub
 */
function obterDataUltimoCommit() {
  try {
    const url =
      "https://api.github.com/repos/tmcnet/tesouro-direto-dados/commits" +
      "?path=precos/rendimento-resgatar.csv&per_page=1";

    const resp = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      headers: {
        Accept: "application/vnd.github.v3+json"
      }
    });

    if (resp.getResponseCode() !== 200) {
      return null;
    }

    const data = JSON.parse(resp.getContentText());
    if (!data || data.length === 0) {
      return null;
    }

    return new Date(data[0].commit.committer.date);
  } catch (e) {
    return null;
  }
}

/**
 * Aplica cor indicativa baseada na idade do commit
 */
function aplicarIndicadorCommit(cell, commitDate) {
  if (!commitDate) {
    cell.setBackground("#e0e0e0"); // cinza
    return;
  }

  const agora = new Date();
  const diffHoras = (agora - commitDate) / (1000 * 60 * 60);

  if (diffHoras <= 24) {
    cell.setBackground("#d9ead3"); // verde claro
  } else if (diffHoras <= 72) {
    cell.setBackground("#fff2cc"); // amarelo
  } else {
    cell.setBackground("#f4cccc"); // vermelho claro
  }
}

function protegerAbaSource() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = "Tesouro Direto (Source)";
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return;
  }

  // Remove proteções antigas da aba
  const protecoes = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET);
  protecoes.forEach(p => p.remove());

  // Cria nova proteção
  const protection = sheet.protect();
  protection.setDescription("Aba SOURCE - edição bloqueada");

  // Permite edição apenas ao dono
  protection.removeEditors(protection.getEditors());

  // Garante que nem domínio pode editar
  if (protection.canDomainEdit()) {
    protection.setDomainEdit(false);
  }
}