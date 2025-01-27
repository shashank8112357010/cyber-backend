const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()
const path = require('path')
const cors = require('cors')

// Route imports
const userRoutes = require('./routes/userRoutes')
const helpRoutes = require('./routes/helpRoutes')
const blogRoutes = require('./routes/blogRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes.js')
const testimonialRoutes = require('./routes/testimonialRoutes')


const app = express()
app.use(cors({}))

app.use(bodyParser.json())
app.use('/cyber/uploads', express.static(path.join(__dirname, 'uploads')))

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('DB Connection Error:', err))
app.get('/cyber/test', (req, res) => res.send('Server is up for cyber api..'))
// Routes
app.use('/cyber/api/users', userRoutes) // User routes
app.use('/cyber/api/help', helpRoutes) // Help request routes
app.use('/cyber/api/blogs', blogRoutes) // Blog routes
app.use('/cyber/api/testimonials', testimonialRoutes) // Testimonial routes
app.use('/cyber/api/dashboard', dashboardRoutes) // Testimonial routes



// Server Setup
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
