const path = require('path')
const { check } = require('express-validator')

const userValidations = {
  registerValidations: [
    check('name')
      .notEmpty().withMessage('Completa este campo').bail()
      .isLength({ min: 2, max: 20 }).withMessage('Ingresa entre 2 y 20 caracteres').bail()
      .isAlpha().withMessage('Ingresa solo letras').bail(),
    check('surname')
      .notEmpty().withMessage('Completa este campo').bail()
      .isLength({ min: 2, max: 20 }).withMessage('Ingresa entre 2 y 20 caracteres').bail()
      .isAlpha().withMessage('Ingresa solo letras').bail(),
    check('email')
      .notEmpty().withMessage('Completa este campo').bail()
      .isEmail().withMessage('Ingresa una dirección de e-mail válida').bail(),
    check('password')
      .notEmpty().withMessage('Completa este campo').bail()
      .isLength({ min: 8, max: 20 }).withMessage('Ingresa entre 8 y 20 caracteres').bail(),
    // Cómo la hago STRONG? Se puede hacer custom no más.
    check('passwordCheck')
      .custom((match, { req }) => {
        const password = req.body.password
        if (password !== match) {
          throw new Error('Las contraseñas deben coincidir')
        } else {
          return true
        };
      }).bail(),
    check('avatar')
      .custom((value, { req }) => {
        const file = req.file
        const okExtensions = [
          '.jpg',
          '.jpeg',
          '.png',
          '.webp'
        ]
        if (!file) {
          throw new Error('Subi una imágen de perfil')
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
    check('newsletter')
      .notEmpty().withMessage('Selecciona una opción').bail(),
    check('tyc')
      .notEmpty().withMessage('Leé y acepta los términos y condiciones').bail()
  ],

  loginValidations: [
    check('email')
      .notEmpty().withMessage('Ingresa tu e-mail').bail(),
    check('password')
      .notEmpty().withMessage('Ingresa tu contraseña').bail()
  ]
}

module.exports = userValidations
