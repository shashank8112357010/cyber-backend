const express = require('express')
const router = express.Router()

// Import your models
const Blog = require('../models/Blog')
const contact = require('../models/Contact')
const User = require('../models/User')
const {
  authenticate,
  authorizeAdmin
} = require('../middlewares/authMiddleware')

// Route to fetch counts and last updated timestamps of various collections
router.get('/count', authenticate(), authorizeAdmin(), async (req, res) => {
  try {
    // Count the number of documents and get the last updated time for each collection
    const blogCount = await Blog.countDocuments()
    const blogLastUpdated = await Blog.findOne()
      .sort({ updatedAt: -1 })
      .select('updatedAt')

    const contactCount = await contact.countDocuments()
    const contactLastUpdated = await contact.findOne()
      .sort({ updatedAt: -1 })
      .select('updatedAt')

    const userCount = await User.countDocuments()
    const userLastUpdated = await User.findOne()
      .sort({ updatedAt: -1 })

      
      .select('updatedAt')

      const testimonialCount = await Testimonial.countDocuments()
      const testimonialLastUpdated = await Testimonial.findOne()
        .sort({ updatedAt: -1 })
        .select('updatedAt')

    // New additions

    // Return the counts and last updated timestamps as a JSON response
    return res.status(200).json({
      success: true,
      data: {
        blog: {
          count: blogCount,
          lastUpdated: blogLastUpdated ? blogLastUpdated.updatedAt : null
        },
        help: {
          count: contactCount,
          lastUpdated: contactLastUpdated
            ? contactLastUpdated.updatedAt
            : null
        },
        testimonial: {
          count: testimonialCount,
          lastUpdated: testimonialLastUpdated
            ? testimonialLastUpdated.updatedAt
            : null
        },

        user: {
          count: userCount,
          lastUpdated: userLastUpdated ? userLastUpdated.updatedAt : null
        }
      }
    })
  } catch (error) {
    console.error('Error fetching counts and last updated:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch counts and last updated timestamps'
    })
  }
})

module.exports = router
