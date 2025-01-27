const HelpRequest = require('../models/HelpRequest')
const { helpRequestSchema } = require('../validation/validation')
const { sendMail } = require('../common/sendmail') // Import the sendMail function
const User = require('../models/User')

exports.createHelpRequest = async (req, res) => {
  const { error } = helpRequestSchema.validate(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

  try {
    const helpRequest = new HelpRequest({ ...req.body, userId: req.user.id })
    await helpRequest.save()
    res
      .status(201)
      .json({ message: 'Help request submitted successfully', helpRequest })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getAllHelpRequestByUser = async (req, res) => {
  try {
    const helpRequests = await HelpRequest.findOne({ userId: req.user.userId })
    if (!helpRequests) {
      res.status(204).json({ success: true, message: 'No Content', data: [] })
    }
    res.status(200).json({
      success: true,
      message: 'Help request fetched successfully',
      data: helpRequests
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getAllHelpRequests = async (req, res) => {
  try {
    const helpRequests = await HelpRequest.find()
    if (!helpRequests) {
      res.status(204).json({ success: true, message: 'No Content', data: [] })
    }
    res.status(200).json({
      success: true,
      message: 'Help request fetched successfully',
      data: helpRequests
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Update the help request status to 'done' and notify the user via email
exports.updateHelpRequestStatus = async (req, res) => {
  const { helpRequestId } = req.params

  try {
    // Find the help request by ID
    const helpRequest = await HelpRequest.findById(helpRequestId)
    if (!helpRequest) {
      return res.status(404).json({ message: 'Help request not found' })
    }

    // Update the status to 'done'
    helpRequest.status = 'done'
    await helpRequest.save()

    // Get the user's email
    const user = await User.findById(helpRequest.userId) // Assuming userId is stored in the help request

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Send an email notification to the user
    const subject = 'Your Help Request has been Resolved'
    const message =
      'Your query has been successfully resolved. Thank you for reaching out to us!'
    await sendMail(user.email, subject, message)

    // Respond to the request
    res.status(200).json({
      success: true,
      message: 'Help request marked as done and user notified via email'
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.deleteHelpRequest = async (req, res) => {
  const { helpRequestId } = req.params

  try {
    // Find and delete the help request by ID
    const helpRequest = await HelpRequest.findByIdAndDelete(helpRequestId)

    if (!helpRequest) {
      return res.status(404).json({ message: 'Help request not found' })
    }

    // Respond to the request
    res.status(200).json({
      success: true,
      message: 'Help request deleted successfully'
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
