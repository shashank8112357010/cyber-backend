const nodemailer = require('nodemailer')
require('dotenv').config()

exports.sendMail = async (email, subject, message) => {
  try {
    // Create the transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: message
    })

    console.log('Email sent successfully: ', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email: ', error)
    return { success: false, error: error.message }
  }
}
