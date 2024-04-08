const { Transform } = require('stream')
const { pool } = require('./db')

let rowIdx = 1
module.exports = {
  adjacencyTransform: new Transform({
    objectMode: true,
    transform (chunk, encoding, callback) {
      const sql = 'INSERT INTO adjacency_regions (zip_code, adj_zip_code) VALUES (?, ?)'
      const values = [
        chunk.ZipCode,
        chunk.AdjacentZipCode
      ]
      callback(null, [[sql], [values]])
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
      callback(null, [[sql], [values]])
    }
  }),
  weatherTransform: new Transform({
    objectMode: true,
    async transform (chunk, encoding, callback) {
      const windSql = 'INSERT INTO wind (wind_gust, wind_speed, wind_direction) VALUES (?, ?, ?)'
      const windValues = [
        parseFloat(chunk.windgust),
        parseFloat(chunk.windspeed),
        parseInt(chunk.winddir)
      ]
      const temperatureSql = 'INSERT INTO temperature (temp, feelslike) VALUES (?, ?)'
      const temperatureValues = [
        parseFloat(chunk.temp),
        parseFloat(chunk.feelslike)
      ]
      const percipitationSql = 'INSERT INTO precipitation (precip, precipprob, preciptype) VALUES (?, ?, ?)'
      const precipitationValues = [
        parseFloat(chunk.precip),
        parseInt(chunk.precipprob),
        chunk.preciptype
      ]
      const humiditySql = 'INSERT INTO humidity (dew, humidity) VALUES (?, ?)'
      const humidityValues = [
        parseFloat(chunk.dew),
        parseFloat(chunk.humidity)
      ]
      const [date, time] = chunk.datetime.split('T')
      const dateSql = 'INSERT INTO date (date, hour_of_day, sunrise, sunset) VALUES (?, ?, ?, ?)'
      const dateValues = [
        date,
        parseInt(time.substring(0, 2)),
        chunk.sunrise,
        chunk.sunset
      ]

      const factSql = 'INSERT INTO weather_fact (date_id, wind_id, temperature_id, humidity_id, precipitation_id, location_id) VALUES (?, ?, ?, ?, ?, ?)'
      const zipCode = chunk.name.split(',')[0]
      const [zipResult] = await pool.execute(`SELECT id FROM location WHERE zip_code = ${zipCode}`)
      const factValues = [
        rowIdx,
        rowIdx,
        rowIdx,
        rowIdx,
        rowIdx,
        zipResult[0].id
      ]
      rowIdx += 1
      callback(null, [[windSql, temperatureSql, percipitationSql, humiditySql, dateSql, factSql], [windValues, temperatureValues, precipitationValues, humidityValues, dateValues, factValues]])
    }
  })
}
