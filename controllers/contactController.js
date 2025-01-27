const { sendMail } = require('../common/sendmail.js')
const ContactUs = require('../models/Contact.js')

exports.submitContactForm = async (req, res) => {
    try {
        const contactData = req.body

        // Validate consent
        if (!contactData.consent) {
            return res
                .status(400)
                .json({ message: 'You must consent to data collection.' })
        }

        // Create a new contact entry
        const newContact = new ContactUs(contactData)
        await newContact.save()

        // Send email to user confirming submission
        const subject = 'Thank you for contacting us!'
        const message = `
      Hi ${newContact.name},

      Thank you for reaching out to us. We have received your query and will get back to you shortly.

      Details:
      - Subject: ${newContact.servicesInterestedIn.join(', ')}
      - Message: ${newContact.additionalNotes || 'No additional notes provided'}

      Regards,
      CybiTude
    `
        await sendMail(newContact.email, subject, message)

        res.status(201).json({
            message: 'Contact form submitted successfully',
            data: newContact
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getAllContactSubmissions = async (req, res) => {
    try {
        const contacts = await ContactUs.find().sort({ createdAt: -1 }) // Sorted by most recent

        res.status(200).json({
            message: 'Contact form submissions retrieved successfully',
            data: contacts
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.updateContactStatus = async (req, res) => {
    try {
        const { contactId } = req.params
        const { status } = req.body

        // Validate status
        if (!['pending', 'in-progress', 'resolved'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' })
        }

        // Find and update the status of the contact form
        const updatedContact = await ContactUs.findByIdAndUpdate(
            contactId,
            { status },
            { new: true }
        )

        if (!updatedContact) {
            return res
                .status(404)
                .json({ message: 'Contact form submission not found' })
        }

        // Send email to user notifying about the status change
        const subject = 'Update on Your Contact Form Submission'
        const message = `
        Hi ${updatedContact.name},
  
        Your query status has been updated to: ${status}.
  
        Details:
        - Subject: ${updatedContact.servicesInterestedIn.join(', ')}
        - Message: ${updatedContact.additionalNotes || 'No additional notes provided'}
  
        If you have any further questions, please feel free to reach out.
  
        Regards,
        CybiTude
      `
        await sendMail(updatedContact.email, subject, message)

        res.status(200).json({
            message: 'Status updated successfully',
            data: updatedContact
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
