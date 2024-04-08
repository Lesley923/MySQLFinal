const { createReadStream } = require('fs')
const { ensureTablesExist, importData, linkTables } = require('./utils')
const { pipeline } = require('stream/promises')
const { dataFilePaths, getTransforms } = require('./file_maps')
const { pool } = require('./db')
const cliProgress = require('cli-progress')

const dbTablesMaps = {
  location: 'Location.sql',
  adjacency_region: 'AdjacencyRegion.sql',
  date: 'Date.sql',
  humidity: 'Humidity.sql',
  precipitation: 'Precipitation.sql',
  temperature: 'Temperature.sql',
  wind: 'Wind.sql',
  weather_fact: 'Weather_Fact.sql'
}
async function processFiles () {
  const multibar = new cliProgress.MultiBar(
    { format: 'Importing {file} [{bar}] {percentage}% | {value}/{total} | Resolved: {resolved} | Errors: {errors}' },
    cliProgress.Presets.shades_classic
  )
  for (const dataFilePath of dataFilePaths) {
    const transforms = getTransforms(dataFilePath)
    await pipeline(
      createReadStream(dataFilePath, { encoding: 'utf-8' }),
      ...transforms,
      importData(multibar, dataFilePath)
    )
  }
  multibar.stop()
}

async function main () {
  try {
    await ensureTablesExist(dbTablesMaps)
    await processFiles()
    await linkTables()
  } catch (error) {
    console.error(error)
  } finally {
    await pool.end()
  }
}
main()
