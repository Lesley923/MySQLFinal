const { Router } = require('express')
// const { pool } = require('../mysql/db')
const router = Router({ strict: true })

router.get('/', (req, res) => {
  // const sql = ''
  // pool.execute(sql)
  res.json('This is mysql api')
})

router.get('/forecast', async (req, res) => {
  const { zipcode, datetime } = req.query;
 console.log(datetime);
  if (!zipcode || !datetime) {
      return res.status(400).json({ message: "Please provide both zipcode and datetime." });
  }


  try {
      const [results] = await pool.execute(Q1.sql, [zipcode, datetime]);
      if (results.length === 0) {
          return res.status(404).json({ message: "No forecast data found." });
      }
      res.json(results);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching forecast data." });
  }
});



module.exports = router
