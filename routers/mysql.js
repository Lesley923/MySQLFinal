const { Router } = require('express')
const { pool } = require('../mysql/db')
const router = Router({ strict: true })
const fs = require('fs').promises;
const path = require('path');

router.get('/', (req, res) => {
    res.json("This is mysql api");
})



router.get('/advice', async (req, res) => {
  const { zipcode, date } = req.query;
  
  if (!zipcode || !date) {
      return res.status(400).json({ message: "Please provide both zipcode and datetime." });
  }


  try {
    const sql1Path = path.join(__dirname,'..', 'mysql', 'sql', 'sunrise.sql');
    const sql2Path = path.join(__dirname, '..', 'mysql', 'sql', 'sunset.sql');
    const sql3Path = path.join(__dirname, '..', 'mysql', 'sql', 'outdoorAdvice.sql');

      const sql1 = await fs.readFile(sql1Path, 'utf8');
      const sql2 = await fs.readFile(sql2Path, 'utf8');
      const sql3 = await fs.readFile(sql3Path, 'utf8');
      const [results1] = await pool.execute(sql1, [zipcode, date]);
      const [results2] = await pool.execute(sql2, [zipcode, date]);
      const [results3] = await pool.execute(sql3, [zipcode, date]);
      if (results1.length === 0) {
          return res.status(404).json({ message: "No sunrise data found." });
      }
      if (results2.length === 0) {
        return res.status(404).json({ message: "No sunset data found." });
      }
      if (results3.length === 0) {
        return res.status(404).json({ message: "No outdoor advice data found." });
    }
      res.json({ results1, results2, results3 });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching forecast data." });
  }
});



module.exports = router
