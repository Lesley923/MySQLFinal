const { readFile } = require('fs/promises')
const path = require('path')
const { pool } = require('./db')
const cliProgress = require('cli-progress')

const sqlRoot = path.join(__dirname, 'sql')

const importData = (multibar, filePath) => {
  const queries = []
  const barStatus = {
    resolved: 0,
    errors: 0,
    file: path.basename(filePath)
  }
  const bar = multibar.create(queries.length, barStatus.errors + barStatus.resolved, barStatus)
  return (stream) => {
    stream.on('data', (chunk) => {
      const [sql, values] = chunk
      queries.push(
        pool.execute(sql, values)
          .then(() => bar.update(null, { resolved: ++barStatus.resolved }))
          .catch((err) => {
            console.error(err)
            bar.update(null, { errors: ++barStatus.errors })
          })
          .finally(() => bar.increment())
      )
      bar.setTotal(queries.length)
    })
    stream.on('error', (error) => {
      throw error
    })
    return new Promise((resolve) => {
      stream.on('end', async () => {
        await Promise.all(queries)
        resolve()
      })
    })
  }
}
const linkTables = async () => {
  const sqls = await readFile(path.join(sqlRoot, 'alters.sql'), { flag: 'r', encoding: 'utf-8' })
  const sqlStatements = sqls.split(';').filter(sql => sql.trim() !== '')
  await Promise.all(sqlStatements.map(sql => pool.execute(sql)))
}
/**
 *
 * @param {Object} tableMaps
 */
async function ensureTablesExist (tableMaps) {
  const bar = new cliProgress.SingleBar({
    format: 'Checking Tables [{bar}] {percentage}% | {value}/{total}'
  }, cliProgress.Presets.shades_classic)
  bar.start(Object.keys(tableMaps).length, 0)
  try {
    await Promise.all(Object.entries(tableMaps).map((tableEntry, _, arr) =>
      createTable(tableEntry).finally(() => bar.increment())
    ))
    bar.stop()
  } catch (error) {
    console.error(error)
  }
}
async function createTable (tableEntry) {
  const [result] = await pool.query('SHOW TABLES LIKE ?', [tableEntry[0]])
  if (result.length === 0) {
    const sql = await readFile(path.join(sqlRoot, tableEntry[1]), { flag: 'r', encoding: 'utf-8' })
    await pool.execute(sql)
  }
}
module.exports = { ensureTablesExist, importData, linkTables }
