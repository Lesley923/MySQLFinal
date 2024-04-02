const { createReadStream } = require('fs')
const { ensureTablesExist } = require('./utils')
const { pipeline } = require('stream/promises')
const { insertData } = require('./transforms')
const { dataFilePaths, getTransforms } = require('./file_maps')
const pool = require('./db')

const dbTablesMaps = {
  Locations: 'Locations.sql',
  AdjacencyRegions: 'AdjacencyRegions.sql'
}

async function processFiles () {
  await Promise.all(dataFilePaths.map(async (dataFilePath) => {
    const transforms = getTransforms(dataFilePath)
    await pipeline(
      createReadStream(dataFilePath, { encoding: 'utf-8' }),
      ...transforms,
      insertData
    )
  }))
}

async function main () {
  try {
    await ensureTablesExist(dbTablesMaps)
    await processFiles()
  } catch (error) {
    console.error(error)
  } finally {
    await pool.end()
    console.log('Pool End')
  }
}
main()
