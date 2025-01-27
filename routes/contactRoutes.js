const express = require('express')
const {
  submitContactForm,
  getAllContactSubmissions,
  updateContactStatus
} = require('../controllers/contactController.js')

const router = express.Router()

// User route
router.post('/', submitContactForm)

// Admin routes
router.get('/',  getAllContactSubmissions)
router.put('/:contactId',  updateContactStatus)

module.exports = router
