import * as SQLite from 'expo-sqlite';

export async function openDatabase() {
  try {
    global.db = await SQLite.openDatabaseAsync('EtecJobs');

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tb_vagas_salvas (
        cdvaga INT NOT NULL PRIMARY KEY,
        id_tipo_vaga INT NOT NULL,
        nm_vaga VARCHAR(80) NOT NULL,
        ds_vaga TEXT NOT NULL,
        ds_keywords VARCHAR(100) NOT NULL,
        st_vaga CHAR(1) NOT NULL,
        dt_registro_vaga DATETIME NOT NULL,
        url_imagem_vaga VARCHAR(200) NOT NULL,
        nm_tipo_vaga VARCHAR(100) NOT NULL
      );
    `);
  } catch (error) {
    console.error('Erro ao abrir o banco de dados: ', error);
  }
}

export async function VagasSalvas() {
  const rep = await global.db.getAllAsync('SELECT * FROM tb_vagas_salvas');
  return rep;
}
 
export async function SalvarVaga(
  cdvaga,
  id_tipo_vaga,
  nm_vaga,
  ds_vaga,
  ds_keywords,
  st_vaga,
  dt_registro_vaga,
  url_imagem_vaga,
  nm_tipo_vaga
) {
  await global.db.runAsync(
    `
    INSERT INTO tb_vagas_salvas VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      cdvaga,
      id_tipo_vaga,
      nm_vaga,
      ds_vaga,
      ds_keywords,
      st_vaga,
      dt_registro_vaga,
      url_imagem_vaga,
      nm_tipo_vaga,
    ]
  );
  return true;
}

export async function DesSalvarVaga(cdvaga) {
  await global.db.runAsync(
    `
    DELETE FROM tb_vagas_salvas WHERE cdvaga = ?
  `,
    cdvaga
  );
  return true;
}
