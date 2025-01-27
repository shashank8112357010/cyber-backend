const jwt = require('jsonwebtoken')

exports.authenticate = () => (req, res, next) => {
  const authHeader = req.header('Authorization')

  // Check if the Authorization header exists
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' })
  }

  // Split the Bearer token
  const token = authHeader.split(' ')[1]
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. Invalid token format.' })
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' })
  }
}

exports.authorizeAdmin = () => (req, res, next) => {
  // Check if the user role is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' })
  }
  next()
}
