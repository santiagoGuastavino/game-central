const express = require('express')
const router = express.Router()
const { totals } = require('../../controllers/api/mainApiController')

router.get(
  '/',
  totals
)

module.exports = router
