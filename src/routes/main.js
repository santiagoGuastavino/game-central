const express = require('express')
const router = express.Router()
const {
  index,
  termsConditions,
  contact
  // processContact
} = require('../controllers/mainController')

router.get(
  '/',
  index
)

router.get(
  '/terms-conditions',
  termsConditions
)

router.get(
  '/contact',
  contact
)

// YET TO IMPLEMENT
// router.post(
//     '/contact',
//     processContact
// );

module.exports = router
