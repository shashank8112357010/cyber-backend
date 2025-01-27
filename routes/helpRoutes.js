const express = require('express')
const {
  authenticate,
  authorizeAdmin
} = require('../middlewares/authMiddleware')
const {
  createHelpRequest,
  getAllHelpRequests,
  updateHelpRequestStatus, // Import the new function
  deleteHelpRequest,
  getAllHelpRequestByUser
} = require('../controllers/helpRequestController')

const router = express.Router()

router.post('/', authenticate(), createHelpRequest)
router.get('/', authenticate(), getAllHelpRequestByUser)

router.get('/users', authenticate(), authorizeAdmin(), getAllHelpRequests)

// New route to update the status of a help request
router.put(
  '/status/:helpRequestId',
  authenticate(),
  authorizeAdmin(),
  updateHelpRequestStatus
)

// New route to delete a help request
router.delete(
  '/:helpRequestId',
  authenticate(),
  authorizeAdmin(),
  deleteHelpRequest
)

module.exports = router
