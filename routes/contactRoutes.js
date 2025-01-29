const express = require('express')
const {
  submitContactForm,
  getAllContactSubmissions,
  updateContactStatus,
  downloadContactSubmissions,
  downloadContactSubmissionsPdf
} = require('../controllers/contactController.js')
const {
  authorizeAdmin,
  authenticate
} = require('../middlewares/authMiddleware.js')

const router = express.Router()

// User route
router.post('/', submitContactForm)

// Admin routes
router.put('/:contactId', updateContactStatus)
router.get('/', getAllContactSubmissions)

router.get('/download/csv', downloadContactSubmissions)
router.get('/download/pdf', downloadContactSubmissionsPdf)

router.put('/:contactId', updateContactStatus)

module.exports = router
