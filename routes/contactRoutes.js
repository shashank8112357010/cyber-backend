const express = require('express');
const {
  submitContactForm,
  getAllContactSubmissions,
  updateContactStatus,
} = require('../controllers/contactController.js');
const {
  authenticate,
  authorizeAdmin,
} = require('../middlewares/authMiddleware.js');

const router = express.Router();

// User route
router.post('/', submitContactForm);

// Admin routes
router.get('/', authenticate, authorizeAdmin, getAllContactSubmissions);
router.put('/:contactId', authenticate, authorizeAdmin, updateContactStatus);

module.exports = router;
