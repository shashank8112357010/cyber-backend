const express = require('express')
const router = express.Router()
const Subscribe = require('../models/Subscribe.js')
const {
    authenticate,
    authorizeAdmin
} = require('../middlewares/authMiddleware.js')

// Route to fetch counts and last updated timestamps of various collections
router.post('/', async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            })
        }

        // Check if the email is already subscribed
        const existingSubscribe = await Subscribe.findOne({ email })

        if (existingSubscribe) {
            return res.status(400).json({
                success: false,
                message: 'Email is already subscribed'
            })
        }

        // Create a new subscribe
        await Subscribe.create({
            email
        })

        // Return the counts and last updated timestamps as a JSON response
        return res
            .status(200)
            .json({ error: false, success: true, message: 'Subscribed successfully' })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create subscribe'
        })
    }
})

// Route to fetch all subscribes
router.get('/', authenticate(), authorizeAdmin(), async (req, res) => {
    try {
        // Fetch all subscribes
        const subscribes = await Subscribe.find()

        if (!subscribes) {
            return res.status(404).json({
                success: false,
                message: 'Subscribes not found'
            })
        }

        // Return the counts and last updated timestamps as a JSON response
        return res.status(200).json({ error: false, success: true, subscribes })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch subscribes'
        })
    }
})

module.exports = router
