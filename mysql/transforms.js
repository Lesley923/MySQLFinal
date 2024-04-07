const { Transform } = require('stream')
module.exports = {
  adjacencyTransform: new Transform({
    objectMode: true,
    transform (chunk, encoding, callback) {
      const sql = 'INSERT INTO adjacency_regions (zip_code, adj_zip_code) VALUES (?, ?)'
      const values = [
        chunk.ZipCode,
        chunk.AdjacentZipCode
      ]
      callback(null, [sql, values])
    }
  }),
  locationTransform: new Transform({
    objectMode: true,
    transform (chunk, encoding, callback) {
      const sql = 'INSERT INTO location (name, address, zip_code, latitude, longitude) VALUES (?, ?, ?, ?, ?)'
      const values = [
        chunk.Name,
        chunk.Address,
        chunk['Zip Code'],
        chunk.Latitude,
        chunk.Longitude
      ]
      callback(null, [sql, values])
    }
  }),
  weatherTransform: new Transform({
    objectMode: true,
    transform (chunk, encoding, callback) {

    }
  })
}
