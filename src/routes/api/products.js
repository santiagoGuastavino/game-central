const express = require('express')
const router = express.Router()
const {
  oneGame,
  lastGame,
  freeTitle,
  list
} = require('../../controllers/api/productsApiController')

router.get(
  '/detail/:id',
  oneGame
)

router.get(
  '/last',
  lastGame
)

// para validación del front
router.post(
  '/free-title',
  freeTitle
)

router.get(
  '/:id?',
  list
)

module.exports = router
