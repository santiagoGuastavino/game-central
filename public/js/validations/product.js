import { getCurrentUrl } from '../utils/helper.js'
const currentUrl = getCurrentUrl()

const form = document.querySelector('.product-create-form')

const title = form.title
const categories = form.categories
const platforms = form.platforms
const img = form.img
const relevant = form.relevant
const offer = form.offer
const price = form.price
const discount = form.discount
const description = form.description

const platformsLabel = document.querySelectorAll('.label-platforms')
const imgLabel = document.querySelector('#img-label')
const relevantLabel = document.querySelectorAll('.label-relevant')
const offerLabel = document.querySelectorAll('.label-offer')
const priceSpanValidation = document.querySelector('#price-span')
const discountSpanValidation = document.querySelector('#discount-span')

let errors = []

const errorBoxes = document.querySelectorAll('.error-box')

// <!-- title -->
title.addEventListener('input', validateTitle, false)
title.addEventListener('blur', validateTitle, false)
// <!-- categories -->
for (const category of categories) {
  category.addEventListener('change', () => {
    validateCategories(category)
  })
};
// <!-- platforms -->
for (const platform of platforms) {
  platform.addEventListener('change', () => {
    validatePlatforms()
  })
};
// <!-- img -->
img.addEventListener('input', validateImg, false)
img.addEventListener('blur', validateImg, false)
// <!-- relevant -->
for (const option of relevant) {
  option.addEventListener('change', () => {
    validateRelevant()
  })
};
// <!-- offer -->
for (const option of offer) {
  option.addEventListener('change', () => {
    validateOffer()
  })
};
// <!-- price -->
price.addEventListener('input', validatePrice, false)
price.addEventListener('blur', validatePrice, false)
// <!-- discount -->
discount.addEventListener('input', validateDiscount, false)
discount.addEventListener('blur', validateDiscount, false)
// <!-- description -->
description.addEventListener('input', validateDescription, false)
description.addEventListener('blur', validateDescription, false)

form.addEventListener('submit', (e) => {
  validateTitle()
  for (const category of categories) {
    validateCategories(category)
  };
  validatePlatforms()
  validateImg()
  validateRelevant()
  validateOffer()
  validatePrice()
  validateDiscount()
  validateDescription()
  if (errors.length > 0) {
    e.preventDefault()
  } else {
    form.submit()
  };
})

const regexImgExt = /\.(gif|jpe?g|png|webp)$/i
const regexDecimal = /^\s*-?\d+(\.\d{1,2})?\s*$/
const regexTwoDigitNumber = /^[0-9]{2}$/

function validateTitle () {
  if (!title.value) {
    errors.push({
      field: 'title',
      msg: 'Completa este campo'
    })
  } else if (title.value.length < 2 || title.value.length > 30) {
    errors.push({
      field: 'title',
      msg: 'Ingresa entre 2 y 30 caracteres'
    })
  } else {
    const newTitle = title.value.toUpperCase()
    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: newTitle
      })
    }
    fetch(`${currentUrl}/api/products/free-title`, settings)
      .then(response => response.json())
      .then(response => {
        response.result === false
          ? errors.push({
            field: 'title',
            msg: response.msg
          })
          : errors = errors.filter(
            error => error.field !== 'title'
          )
      })
      .catch(err => {
        throw new Error(err)
      })
  };
  errorClass(title)
  printErr()
};

function validateCategories (category) {
  if (category.value === '0') {
    errors.push({
      field: 'categories' + category.id,
      msg: 'Asigna la ' + category.id + 'º categoría'
    })
    category.classList.add('error-input')
  } else {
    errors = errors.filter(
      error => error.field !== 'categories' + category.id
    )
    category.classList.remove('error-input')
  };
  printErr()
};

function validatePlatforms () {
  let oneChecked = false
  platforms.forEach(platform => {
    if (platform.checked === true) {
      oneChecked = true
      return oneChecked
    };
  })
  if (oneChecked !== true) {
    errors.push({
      field: 'platforms',
      msg: 'Elije al menos una plataforma'
    })
    for (const label of platformsLabel) {
      label.classList.add('error-input')
    };
  } else {
    errors = errors.filter(
      error => error.field !== 'platforms'
    )
    for (const label of platformsLabel) {
      label.classList.remove('error-input')
    };
  };
  printErr()
};

function validateImg () {
  if (document.URL === 'http://localhost:3001/products/create') {
    if (!img.value) {
      errors.push({
        field: 'img',
        msg: 'Subi una imágen del producto'
      })
      imgLabel.classList.add('error-input')
    } else if (!regexImgExt.test(img.value)) {
      errors.push({
        field: 'img',
        msg: 'La imágen solo puede ser \'.jpg\', \'.jpeg\', \'.png\' o \'.webp\''
      })
      imgLabel.classList.add('error-input')
    } else {
      errors = errors.filter(
        error => error.field !== 'img'
      )
      imgLabel.classList.remove('error-input')
    };
    printErr()
  } else {
    if (img.value && !regexImgExt.test(img.value)) {
      errors.push({
        field: 'img',
        msg: 'La imágen solo puede ser \'.jpg\', \'.jpeg\', \'.png\' o \'.webp\''
      })
      imgLabel.classList.add('error-input')
    } else {
      errors = errors.filter(
        error => error.field !== 'img'
      )
      imgLabel.classList.remove('error-input')
    };
    printErr()
  };
};

function validateRelevant () {
  if (relevant.value === '') {
    errors.push({
      field: 'relevant',
      msg: 'Selecciona una opción'
    })
    for (const label of relevantLabel) {
      label.classList.add('error-input')
    };
  } else {
    errors = errors.filter(
      error => error.field !== 'relevant'
    )
    for (const label of relevantLabel) {
      label.classList.remove('error-input')
    };
  };
  printErr()
};

function validateOffer () {
  if (offer.value === '') {
    errors.push({
      field: 'offer',
      msg: 'Selecciona una opción'
    })
    for (const label of offerLabel) {
      label.classList.add('error-input')
    };
  } else {
    errors = errors.filter(
      error => error.field !== 'offer'
    )
    for (const label of offerLabel) {
      label.classList.remove('error-input')
    };
  };
  validateDiscount()
  printErr()
};

function validatePrice () {
  if (!price.value) {
    errors.push({
      field: 'price',
      msg: 'Completa este campo'
    })
  } else if (price.value === 0 || price.value < 1 || price.value > 9999) {
    errors.push({
      field: 'price',
      msg: 'Ingresa un número entre 1 y 9999'
    })
  } else if (!regexDecimal.test(price.value)) {
    errors.push({
      field: 'price',
      msg: 'Ingresa hasta dos decimales'
    })
  } else {
    errors = errors.filter(
      error => error.field !== 'price'
    )
  };
  errorPriceClass()
  printErr()
};

function validateDiscount () {
  console.log(offer.value)
  if (offer.value === 'true') {
    if (!discount.value) {
      errors.push({
        field: 'discount',
        msg: 'Asigna un porcentaje de descuento'
      })
    } else if (discount.value < 1 || discount.value > 99) {
      errors.push({
        field: 'discount',
        msg: 'Ingresa un número entre 1 y 99'
      })
    } else if (!regexTwoDigitNumber.test(discount.value)) {
      errors.push({
        field: 'discount',
        msg: 'Ingresa dos dígitos sin decimales'
      })
    } else {
      errors = errors.filter(
        error => error.field !== 'discount'
      )
    };
  } else if (offer.value === 'false' || !offer.value) {
    errors = errors.filter(
      error => error.field !== 'discount'
    )
  };
  console.log(errors)
  errorDiscountClass()
  printErr()
};

function validateDescription () {
  if (!description.value) {
    errors.push({
      field: 'description',
      msg: 'Completa este campo'
    })
  } else if (description.value.length < 20 || description.value.length > 3000) {
    errors.push({
      field: 'description',
      msg: 'Ingresa entre 20 y 3000 caracteres'
    })
  } else {
    errors = errors.filter(
      error => error.field !== 'description'
    )
  };
  errorClass(description)
  printErr()
};

function errorClass (field) {
  field.classList.remove('error-input')
  errors.forEach(error => {
    if (error.field === field.id) {
      field.classList.add('error-input')
    };
  })
};

function errorPriceClass () {
  price.classList.remove('error-input-price')
  priceSpanValidation.classList.remove('error-span-price')
  errors.forEach(error => {
    if (error.field === 'price') {
      price.classList.add('error-input-price')
      priceSpanValidation.classList.add('error-span-price')
    };
  })
};

function errorDiscountClass () {
  discount.classList.remove('error-input-price')
  discountSpanValidation.classList.remove('error-span-price')
  errors.forEach(error => {
    if (error.field === 'discount') {
      discount.classList.add('error-input-price')
      discountSpanValidation.classList.add('error-span-price')
    };
  })
};

function printErr () {
  for (const box of errorBoxes) {
    box.innerHTML = ''
    errors.forEach(error => {
      if (error.field === box.id) {
        box.innerHTML = `<span class="error-msg">${error.msg}</span>`
      };
    })
  };
};
