const { Router } = require('express')
const { pool } = require('../mysql/db')
const router = Router({ strict: true })
const fs = require('fs').promises
const path = require('path')

router.get('/', (req, res) => {
  res.sendFile('mysqlindex.html')
})

router.get('/advice', async (req, res) => {
  const { zipcode, date } = req.query

  if (!zipcode || !date) {
    return res.status(400).json({ message: 'Please provide both zipcode and datetime.' })
  }

  try {
    const sql1Path = path.join(__dirname, '..', 'mysql', 'sql', 'sunrise.sql')
    const sql2Path = path.join(__dirname, '..', 'mysql', 'sql', 'sunset.sql')
    const sql3Path = path.join(__dirname, '..', 'mysql', 'sql', 'outdoorAdvice.sql')

    const sql1 = await fs.readFile(sql1Path, 'utf8')
    const sql2 = await fs.readFile(sql2Path, 'utf8')
    const sql3 = await fs.readFile(sql3Path, 'utf8')
    const [results1] = await pool.execute(sql1, [zipcode, date])
    const [results2] = await pool.execute(sql2, [zipcode, date])
    const [results3] = await pool.execute(sql3, [zipcode, date])
    results1.forEach(result => {
      if (result.date instanceof Date) {
        // Format the date as a YYYY-MM-DD string
        result.date = result.date.toISOString().split('T')[0]
      }
    })
    results2.forEach(result => {
      if (result.date instanceof Date) {
        // Format the date as a YYYY-MM-DD string
        result.date = result.date.toISOString().split('T')[0]
      }
    })
    results3.forEach(result => {
      if (result.date instanceof Date) {
        // Format the date as a YYYY-MM-DD string
        result.date = result.date.toISOString().split('T')[0]
      }
    })
    if (results1.length === 0) {
      return res.status(404).json({ message: 'No sunrise data found.' })
    }
    if (results2.length === 0) {
      return res.status(404).json({ message: 'No sunset data found.' })
    }
    if (results3.length === 0) {
      return res.status(404).json({ message: 'No outdoor advice data found.' })
    }
    res.json({ results1, results2, results3 })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error fetching forecast data.' })
  }
})

router.get('/meteoradvice', async (req, res) => {
  const { date } = req.query

  if (!date) {
    return res.status(400).json({ message: 'Please provide a date parameter in the format YYYY-MM-DD.' })
  }

  try {
    const sqlFilePath = path.join(__dirname, '..', 'mysql', 'sql', 'Q3.sql')
    const sqlQuery = await fs.readFile(sqlFilePath, 'utf8')

    const [results] = await pool.execute(sqlQuery, [date, date])
    results.forEach(result => {
      if (result.date instanceof Date) {
        // Format the date as a YYYY-MM-DD string
        result.date = result.date.toISOString().split('T')[0]
      }
    })
    res.json(results)
  } catch (err) {
    console.error('Error executing query:', err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/umbrellaadvice', async (req, res) => {
  const { zipcode, date } = req.query

  if (!zipcode || !date) {
    return res.status(400).json({ message: 'Please provide both a zipcode and date parameter.' })
  }

  try {
    // Load SQL query from file
    const sqlFilePath = path.join(__dirname, '..', 'mysql', 'sql', 'Query2.sql')
    const sqlQuery = await fs.readFile(sqlFilePath, 'utf8')

    // Execute SQL query with provided parameters
    const [results] = await pool.execute(sqlQuery, [zipcode, date])

    // Format date in results, if necessary
    results.forEach(result => {
      if (result.Date instanceof Date) {
        result.Date = result.Date.toISOString().split('T')[0]
      }
    })

    // Send response with results
    res.json(results)
  } catch (err) {
    console.error('Error executing Q2 query:', err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
