const { Transform } = require('stream')
const pool = require('./db')

module.exports = {
  insertData: new Transform({
    objectMode: true,
    async transform (chunk, encoding, callback) {
      try {
        const [sql, values] = chunk
        const [result, fields] = await pool.execute(sql, values)
        callback(null, { result, fields })
      } catch (error) {
        callback(error)
      }
    }
  }),
  adjacencyTransform: new Transform({
    objectMode: true,
    transform (chunk, encoding, callback) {
      const sql = 'INSERT INTO `users`(`name`, `age`) VALUES (?, ?), (?,?)'
      const values = ['Josh', 19, 'Page', 45]
      callback(null, [sql, values])
    }
  }),
  locationTransform: new Transform({
    objectMode: true,
    transform (chunk, encoding, callback) {
      const table = 'Locations'
      const sql = `INSERT INTO ${table} (name, address, zip_code, latitude, longitude) VALUES (?, ?, ?, ?, ?)`
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
  weatherTransform: async function () {

  }
}
