// A continuación, para que si al crear un producto,
// si elijo "¿en oferta?" = "NO", se deshabilita
// el campo de "DESCUENTO"
const offerTrue = document.querySelector('#offer-true')
const offerFalse = document.querySelector('#offer-false')
const inputDiscount = document.querySelector('.input-discount')
const discountSpan = document.querySelector('#discount-span')

offerTrue.addEventListener('change', () => {
  inputDiscount.disabled = false
  inputDiscount.required = true
  inputDiscount.classList.remove('enable-disable-offer')
  discountSpan.classList.remove('enable-disable-offer')
})

offerFalse.addEventListener('change', () => {
  inputDiscount.disabled = true
  inputDiscount.classList.add('enable-disable-offer')
  discountSpan.classList.add('enable-disable-offer')
  inputDiscount.value = null
})

// quiero cambiar las clases de la label cuando check o uncheck el checkbox.
const platformLabel = document.querySelectorAll('.label-platforms')
const platformCheckbox = document.querySelectorAll('.input-checkbox-platform')

// no quiero ver el checkbox en las plataformas.
for (const box of platformCheckbox) {
  box.style.display = 'none'
};

// función que check y uncheck el checkbox que esta oculto.
function switchIt (box) {
  if (box.checked) {
    box.checked = false
  } else {
    box.checked = true
  };
};

// acá capturo y aplico las clases a las label si está checkeado o no el input checkbox.
for (const label of platformLabel) {
  const box = label.lastElementChild
  label.addEventListener('click', () => {
    switchIt(box)
    if (box.checked) {
      label.classList.add('label-platform-checked')
    } else {
      label.classList.remove('label-platform-checked')
    };
  })
};

// con esto hago que si la página refresca y las cajas están "CHECKED",
// aparecen pintadas desde la carga.
// ésto también me sirvió para la edición del producto.
window.addEventListener('load', () => {
  for (const label of platformLabel) {
    const box = label.lastElementChild
    if (box.checked) {
      label.classList.add('label-platform-checked')
    } else {
      label.classList.remove('label-platform-checked')
    };
  };
})

// como con el bloque de código anterior, quiero que si voy a editar
// el producto y el mismo NO ESTÁ EN OFERTA, quiero que el input de
// "discount" se muestre deshabilitado
window.addEventListener('load', () => {
  if (offerFalse.checked) {
    inputDiscount.disabled = true
    inputDiscount.classList.add('enable-disable-offer')
    discountSpan.classList.add('enable-disable-offer')
    inputDiscount.value = null
  };
})

// Quiero programar que cuando hover lo del ejemplo anterior,
// me muestre el nombre de lo que es, no solo ver el ícono.
// Lo voy a hacer a parte porque ésto lo quiero llevar a otras
// vistas.
for (let i = 0; i < platformLabel.length; i++) {
  const icon = platformLabel[i].firstElementChild
  const previousClass = icon.className
  platformLabel[i].addEventListener('mouseover', () => {
    if (icon.classList.contains('fa-windows')) {
      icon.innerText = 'WINDOWS'
      icon.className = ''
      icon.classList.add('label-platforms-icon-text')
    };
    if (icon.classList.contains('fa-apple')) {
      icon.innerText = 'MAC OS'
      icon.className = ''
      icon.classList.add('label-platforms-icon-text')
    };
    if (icon.classList.contains('fa-linux')) {
      icon.innerText = 'LINUX'
      icon.className = ''
      icon.classList.add('label-platforms-icon-text')
    };
    if (icon.classList.contains('fa-vr-cardboard')) {
      icon.innerText = 'VR HEADSET'
      icon.className = ''
      icon.classList.add('label-platforms-icon-text')
    };
  })
  platformLabel[i].addEventListener('mouseout', () => {
    icon.className = previousClass
    icon.innerText = ''
  })
};
