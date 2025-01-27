const express = require('express')
const {
  registerUser,
  loginUser,
  forgetUser,
  resetPassword
} = require('../controllers/userController')
const router = express.Router()

// User Routes
router.post('/auth/register', registerUser)
router.post('/auth/login', loginUser)
router.post('/auth/forget-password', forgetUser)
router.post('/auth/reset-password', resetPassword)

module.exports = router
