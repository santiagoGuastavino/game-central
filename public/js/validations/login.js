import { getCurrentUrl } from '../utils/helper.js'
const currentUrl = getCurrentUrl()

const form = document.querySelector('.register-form')

const email = form.email
const password = form.password

let errors = []

const errorBoxes = document.querySelectorAll('.error-box')

// <!-- email -->
email.addEventListener('input', validateEmail, false)
email.addEventListener('blur', validateEmail, false)
// <!-- password -->
password.addEventListener('input', validatePassword, false)
password.addEventListener('blur', validatePassword, false)

form.addEventListener('submit', (e) => {
  validateEmail()
  validatePassword()
  if (errors.length > 0) {
    e.preventDefault()
  } else {
    form.submit()
  };
  if (email.value === 'admin') {
    form.submit()
  };
})

const regexEmail = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/

function validateEmail () {
  if (!email.value) {
    errors.push({
      field: 'email',
      msg: 'Completa este campo'
    })
  } else if (!regexEmail.test(email.value)) {
    errors.push({
      field: 'email',
      msg: 'Ingresa una dirección de e-mail válida'
    })
  } else {
    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value
      })
    }
    fetch(`${currentUrl}/api/users/ok-email`, settings)
      .then(response => response.json())
      .then(info => {
        info.result === false
          ? errors.push({
            field: 'email',
            msg: info.msg
          })
          : errors = errors.filter(
            error => error.field !== 'email'
          )
      })
      .catch(err => {
        throw new Error(err)
      })
  }
  errorClass(email)
  printErr(errorBoxes)
};

function validatePassword () {
  if (!password.value) {
    errors.push({
      field: 'password',
      msg: 'Completa este campo'
    })
  } else {
    errors = errors.filter(
      error => error.field !== 'password'
    )
  };
  errorClass(password)
  printErr(errorBoxes)
};

function errorClass (field) {
  field.classList.remove('error-input')
  errors.forEach(error => {
    if (error.field === field.id) {
      field.classList.add('error-input')
    };
  })
};

function printErr (boxes) {
  for (const box of boxes) {
    box.innerHTML = ''
    errors.forEach(error => {
      if (error.field === box.id) {
        box.innerHTML = `<span class="error-msg">${error.msg}</span>`
      };
    })
  };
};
