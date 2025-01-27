const Joi = require('joi')

const helpRequestSchema = Joi.object({
  orderId: Joi.string().required(),
  issue: Joi.string().required()
})

const blogSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required()
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})

const emailSchema = Joi.object({
  email: Joi.string().email().required()
})

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
})

module.exports = {
  emailSchema,
  resetPasswordSchema,
  loginSchema,
  registerSchema,
  helpRequestSchema,
  blogSchema
}
