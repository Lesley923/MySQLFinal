const csv = require('csv-parser')
const path = require('path')
const { locationTransform, adjacencyTransform } = require('./transforms')

const dataRoot = path.join(path.dirname(__dirname), 'data')
const fileTransforms = {
  'adjacency_pairs.csv': [csv(), adjacencyTransform],
  'camping.csv': [csv(), locationTransform]
  // "combined_forecasts.json": processWeather
}
function getTransforms (filePath) {
  return fileTransforms[path.basename(filePath)]
}
const dataFilePaths = Object.keys(fileTransforms).map(file => path.join(dataRoot, file))
module.exports = { dataFilePaths, getTransforms }
