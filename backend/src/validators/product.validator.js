const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().trim().max(200).required(),
  description: Joi.string().trim().max(5000).required(),
  price: Joi.number().min(0).required(),
  discount: Joi.number().min(0).max(100).default(0),
  category: Joi.string().trim().lowercase().required(),
  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().required(),
        alt: Joi.string().allow('').default(''),
      })
    )
    .default([]),
  stock: Joi.number().integer().min(0).default(0),
  brand: Joi.string().trim().allow('').default(''),
  tags: Joi.array().items(Joi.string().trim().lowercase()).default([]),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().max(200),
  description: Joi.string().trim().max(5000),
  price: Joi.number().min(0),
  discount: Joi.number().min(0).max(100),
  category: Joi.string().trim().lowercase(),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().required(),
      alt: Joi.string().allow('').default(''),
    })
  ),
  stock: Joi.number().integer().min(0),
  brand: Joi.string().trim().allow(''),
  tags: Joi.array().items(Joi.string().trim().lowercase()),
  isActive: Joi.boolean(),
});

const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().trim().max(1000).required(),
});

module.exports = { createProductSchema, updateProductSchema, reviewSchema };
