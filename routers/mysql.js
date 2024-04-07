const { Router } = require('express')
const { pool } = require('../mysql/db')
const router = Router({ strict: true })

router.get('/', (req, res) => {
  // const sql = ''
  // pool.execute(sql)
  res.json('This is mysql api')
})

module.exports = router
