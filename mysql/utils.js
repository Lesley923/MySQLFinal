const { readFile } = require('fs/promises')
const path = require('path')
const pool = require('./db')

const sqlRoot = path.join(__dirname, 'sql')
/**
 *
 * @param {Object} tableMaps
 */
async function ensureTablesExist (tableMaps) {
  try {
    await Promise.all(Object.entries(tableMaps).map(tableEntry => createTable(tableEntry)))
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
module.exports = { ensureTablesExist }
