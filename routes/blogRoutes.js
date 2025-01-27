const express = require('express')
const {
  authenticate,
  authorizeAdmin
} = require('../middlewares/authMiddleware')
const {
  createBlog,
  getAllBlogs,
  deleteBlog,
  getBlogById
} = require('../controllers/blogController')
const upload = require('../common/multer')
const router = express.Router()

router.post(
  '/',
  authenticate(),
  authorizeAdmin(),
  upload.single('image'),
  createBlog
)
router.get('/', getAllBlogs)

// Delete Blog
router.delete('/:id', authenticate(), authorizeAdmin(), deleteBlog)
router.get('/:id', getBlogById)

module.exports = router
