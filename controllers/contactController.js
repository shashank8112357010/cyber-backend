const { sendMail } = require('../common/sendmail.js')
const ContactUs = require('../models/Contact.js')
const { Parser } = require('json2csv')
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

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
    console.log('reaching')
    const contacts = await ContactUs.find()

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

// create one api so that all data can be downloaded in csv format
exports.downloadContactSubmissions = async (req, res) => {
  try {
    const contacts = await ContactUs.find()

    if (!contacts.length) {
      return res
        .status(404)
        .json({ message: 'No contact form submissions found' })
    }

    const fields = [
      'name',
      'email',
      'phone',
      'companyName',
      'industryType',
      'companySize',
      'websiteUrl',
      'servicesInterestedIn',
      'additionalNotes',
    ]

    const json2csvParser = new Parser({ fields })
    const csv = json2csvParser.parse(contacts)

    res.attachment('contact-submissions.csv')
    res.status(200).send(csv)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


exports.downloadContactSubmissionsPdf = async (req, res) => {
  try {
    const contacts = await ContactUs.find();

    if (!contacts.length) {
      return res.status(404).json({ message: 'No contact form submissions found' });
    }

    const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
    const filePath = path.join(__dirname, 'contact-submissions.pdf');
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Title
    doc.fontSize(18).text('Contact Form Submissions', { align: 'center' }).moveDown(2);

    // Table Headers
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Company Name',
      'Industry Type',
      'Company Size',
      'Website URL',
      'Services Interested In',
      'Additional Notes',

    ];

    const columnWidths = [60, 120, 80, 100, 80, 80, 130, 120, 120]; // Reduced widths
    const columnSpacing = 1; // Adjust spacing between columns

    const startX = 10; // Starting position for columns
    let yPosition = doc.y;

    const drawTableHeader = () => {
      let currentX = startX; // Reset X position
      headers.forEach((header, i) => {
        doc.fontSize(7).font('Helvetica-Bold').text(header, currentX, yPosition, {
          width: columnWidths[i],
          align: 'left',
        });
        currentX += columnWidths[i] + columnSpacing; // Move to the next column
      });
      yPosition += 20; // Move down for rows
    };

    // Draw Headers
    drawTableHeader();

    // Table Rows
    contacts.forEach((contact) => {
      const row = [
        contact.name || '-',
        contact.email || '-',
        contact.phone || '-',
        contact.companyName || '-',
        contact.industryType || '-',
        contact.companySize || '-',
        contact.websiteUrl || '-',
        (contact.servicesInterestedIn || []).join(', ') || '-',
        contact.additionalNotes || '-',


      ];

      let currentX = startX; // Reset X position
      row.forEach((cell, i) => {
        doc.fontSize(8).font('Helvetica').text(cell, currentX, yPosition, {
          width: columnWidths[i],
          align: 'left',
        });
        currentX += columnWidths[i] + columnSpacing; // Move to the next column
      });

      yPosition += 20; // Adjust row spacing

      // Handle Page Break
      if (yPosition > doc.page.height - 50) {
        doc.addPage({ size: 'A4', layout: 'landscape' });
        yPosition = 20;
        drawTableHeader(); // Redraw headers on new page
      }
    });

    // Finalize PDF
    doc.end();

    // Send file after writing
    stream.on('finish', () => {
      res.download(filePath, 'contact-submissions.pdf', (err) => {
        if (err) {
          console.error(err);
        }
        fs.unlinkSync(filePath); // Delete the file after sending
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

