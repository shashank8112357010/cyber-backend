const mongoose = require('mongoose')
const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    message: { type: String, required: true },
    rating: { type: Number, default: 3 },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Testimonial', testimonialSchema)
