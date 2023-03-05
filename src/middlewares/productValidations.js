const path = require('path')
const { check } = require('express-validator')

const productValidations = {
  creationValidations: [
    check('title')
      .notEmpty().withMessage('Completa este campo').bail()
      .isLength({ min: 2, max: 30 }).withMessage('Ingresa entre 2 y 30 caracteres').bail(),
    check('categories')
      .custom((value, { req }) => {
        const categories = req.body.categories
        if (Array.isArray(categories) && categories.length === 4) {
          const hasDuplicates = (array) => {
            return (new Set(array)).size !== array.length
          }
          if (hasDuplicates(categories)) {
            throw new Error('No repitas las categorías')
          } else {
            return true
          };
        } else {
          throw new Error('Asigna cuatro categorías')
        };
      }).bail(),
    check('platforms')
      .notEmpty().withMessage('Elije al menos una plataforma').bail(),
    check('img')
      .custom((value, { req }) => {
        const file = req.file
        const okExtensions = [
          '.jpg',
          '.jpeg',
          '.png',
          '.webp'
        ]
        if (!file) {
          throw new Error('Subi una imágen del producto')
        } else {
          if (!okExtensions.includes(path.extname(file.originalname))) {
            throw new Error(
              'La imágen solo puede ser \'.jpg\', \'.jpeg\', \'.png\' o \'.webp\''
            )
          } else {
            return true
          };
        };
      }).bail(),
    check('relevant')
      .notEmpty().withMessage('Selecciona una opción').bail(),
    check('offer')
      .notEmpty().withMessage('Selecciona una opción').bail(),
    check('price')
      .notEmpty().withMessage('Completa este campo').bail()
      .isDecimal({ decimal_digits: '2' }).withMessage('Ingresa hasta dos decimales').bail()
      .custom(value => {
        if (value < 1 || value > 9999) {
          throw new Error('Ingresa un número entre 1 y 9999')
        } else {
          return true
        };
      }).bail(),
    check('discount')
      .custom((value, { req }) => {
        const offer = req.body.offer
        if (offer === 'true' && value === '') {
          throw new Error('Asigna un porcentaje de descuento')
        } else if (offer === 'true' && (value === 0 || value < 1 || value > 99)) {
          throw new Error('Igresa un número entre 1 y 99')
        } else if (offer === 'false' && value !== null) {
          throw new Error('Este campo debe estar vacío')
        } else {
          return true
        };
      }).bail(),
    check('description')
      .notEmpty().withMessage('Completa este campo').bail()
      .isLength({ min: 20, max: 3000 }).withMessage('Ingresa entre 20 y 3000 caracteres').bail()
  ],

  editValidations: [
    check('title')
      .notEmpty().withMessage('Completa este campo').bail()
      .isLength({ min: 2, max: 30 }).withMessage('Ingresa entre 2 y 30 caracteres').bail(),
    check('categories')
      .custom((value, { req }) => {
        const categories = req.body.categories
        if (Array.isArray(categories) && categories.length === 4) {
          const hasDuplicates = (array) => {
            return (new Set(array)).size !== array.length
          }
          if (hasDuplicates(categories)) {
            throw new Error('No repitas las categorías')
          } else {
            return true
          };
        } else {
          throw new Error('Asigna cuatro categorías')
        };
      }).bail(),
    check('platforms')
      .notEmpty().withMessage('Elije al menos una plataforma').bail(),
    check('img')
      .custom((value, { req }) => {
        if (req.file) {
          const file = req.file
          const okExtensions = [
            '.jpg',
            '.jpeg',
            '.png',
            '.webp'
          ]
          if (!okExtensions.includes(path.extname(file.originalname))) {
            throw new Error(
              'La imágen solo puede ser \'.jpg\', \'.jpeg\', \'.png\' o \'.webp\''
            )
          } else {
            return true
          };
        } else {
          return true
        };
      }).bail(),
    check('relevant')
      .notEmpty().withMessage('Selecciona una opción').bail(),
    check('offer')
      .notEmpty().withMessage('Selecciona una opción').bail(),
    check('price')
      .notEmpty().withMessage('Completa este campo').bail()
      .isDecimal({ decimal_digits: '2' }).withMessage('Ingresa hasta dos decimales').bail()
      .custom(value => {
        if (value < 1 || value > 9999) {
          throw new Error('Ingresa un número entre 1 y 9999')
        } else {
          return true
        };
      }).bail(),
    check('discount')
      .custom((value, { req }) => {
        const offer = req.body.offer
        if (offer === 'true' && value === '') {
          throw new Error('Asigna un porcentaje de descuento')
        } else if (offer === 'true' && (value < 1 || value > 99)) {
          throw new Error('Igresa un número entre 1 y 99')
        } else if (offer === 'false' && value !== null) {
          throw new Error('Este campo debe estar vacío')
        } else {
          return true
        };
      }).bail(),
    check('description')
      .notEmpty().withMessage('Completa este campo').bail()
      .isLength({ min: 20, max: 3000 }).withMessage('Ingresa entre 20 y 3000 caracteres').bail()
  ]
}

module.exports = productValidations
