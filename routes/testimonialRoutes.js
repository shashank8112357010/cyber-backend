const express = require('express')
const {
  authenticate,
  authorizeAdmin
} = require('../middlewares/authMiddleware')
const {
  createTestimonial,
  getAllTestimonials,
  deleteTestimonial
} = require('../controllers/testimonialController')
const upload = require('../common/multer')
const router = express.Router()

// Create a new testimonial
router.post(
  '/',
  authenticate(),
  authorizeAdmin(),
  upload.single('image'),
  createTestimonial
)

// Get all testimonials
router.get('/', getAllTestimonials)

// Delete a testimonial (only accessible by admin)
router.delete(
  '/:testimonialId',
  authenticate(),
  authorizeAdmin(),
  deleteTestimonial
)

module.exports = router
