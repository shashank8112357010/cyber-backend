const mongoose = require('mongoose')

const contactUsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        },
        message: (props) => `${props.value} is not a valid email address!`
      }
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^[0-9]{10,15}$/.test(v)
        },
        message: (props) => `${props.value} is not a valid phone number!`
      }
    },
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    industryType: {
      type: String
    },
    companySize: {
      type: String,
      required: true
    },
    websiteUrl: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^(https?:\/\/)?([\w\d\-]+\.)+\w{2,}(\/.*)?$/.test(v)
        },
        message: (props) => `${props.value} is not a valid website URL!`
      }
    },
    servicesInterestedIn: {
      type: [String],
      required: true,
      enum: ['vapt', 'cloudSecurity', 'forensics', 'other']
    },
    additionalNotes: {
      type: String
    },
    consent: {
      type: Boolean,
      required: true,
      validate: {
        validator: function (v) {
          return v === true // Must be true to consent to data collection
        },
        message: 'You must consent to the collection of your data.'
      }
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved'],
      default: 'pending'
    }
  },
  { timestamps: true }
)


module.exports = mongoose.model('ContactUs', contactUsSchema)