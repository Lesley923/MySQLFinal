const { createReadStream } = require('fs')
const { ensureTablesExist, importData, linkTables } = require('./utils')
const { pipeline } = require('stream/promises')
const { dataFilePaths, getTransforms } = require('./file_maps')
const { pool } = require('./db')
const cliProgress = require('cli-progress')

const dbTablesMaps = {
  Locations: 'Locations.sql',
  AdjacencyRegions: 'AdjacencyRegions.sql'
}
async function processFiles () {
  const multibar = new cliProgress.MultiBar(
    { format: 'Importing {file} [{bar}] {percentage}% | {value}/{total} | Resolved: {resolved} | Errors: {errors}' },
    cliProgress.Presets.shades_classic
  )
  await Promise.all(dataFilePaths.map(async (dataFilePath) => {
    const transforms = getTransforms(dataFilePath)
    await pipeline(
      createReadStream(dataFilePath, { encoding: 'utf-8' }),
      ...transforms,
      importData(multibar, dataFilePath)
    )
  }))
  multibar.stop()
}

async function main () {
  try {
    await ensureTablesExist(dbTablesMaps)
    // await linkTables()
    await processFiles()
  } catch (error) {
    console.error(error)
  } finally {
    await pool.end()
  }
}
main()
