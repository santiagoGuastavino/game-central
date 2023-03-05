// quiero programar que cuando click en editar, se ocultan mis datos y
// aparece el formulario de edición

const profileSection = document.querySelector('.profile-section-profile')
const profileForm = document.querySelector('.profile-section-form')
const editButton = document.querySelector('.edit-profile-button')
const editButtonTextBig = document.querySelector('.edit-profile-button h4')
const editButtonTextSmall = document.querySelector('.edit-profile-button h6')
const delogButton = document.querySelector('#delog-button')
const deleteButton = document.querySelector('#delete-button')

editButtonTextBig.innerText = 'EDITAR MIS DATOS'
editButtonTextSmall.innerText = 'EDITAR MIS DATOS'

editButton.addEventListener('click', () => {
  if (profileForm.classList.contains('profile-section-hide')) {
    switchClasses()
    switchButtonClasses()
    switchText(editButtonTextBig)
    switchText(editButtonTextSmall)
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault()
    })
  } else {
    console.log('acá debería enviar el form')
    switchClasses()
    switchButtonClasses()
    switchText(editButtonTextBig)
    switchText(editButtonTextSmall)
    profileForm.submit()
  };
})

// ésto es lo que oculta y desoculta el formulario de edición
function switchClasses () {
  if (profileForm.classList.contains('profile-section-hide')) {
    profileForm.classList.remove('profile-section-hide')
    profileSection.classList.add('profile-section-hide')
  } else {
    profileForm.classList.add('profile-section-hide')
    profileSection.classList.remove('profile-section-hide')
  };
};

function switchButtonClasses () {
  if (!delogButton.classList.contains('user-control-disable') && !deleteButton.classList.contains('user-control-disable')) {
    delogButton.classList.add('user-control-disable')
    deleteButton.classList.add('user-control-disable')
    delogButton.classList.remove('user-control-button')
    deleteButton.classList.remove('user-control-button')
    deleteButton.classList.remove('user-eliminar')
    delogButton.disabled = true
    deleteButton.disabled = true
  } else {
    delogButton.classList.remove('user-control-disable')
    deleteButton.classList.remove('user-control-disable')
    delogButton.classList.add('user-control-button')
    deleteButton.classList.add('user-control-button')
    deleteButton.classList.add('user-eliminar')
    delogButton.disabled = false
    deleteButton.disabled = false
  };
};

function switchText (thing) {
  if (thing.innerText === 'EDITAR MIS DATOS') {
    thing.innerText = 'GUARDAR CAMBIOS'
  } else if (thing.innerText === 'GUARDAR CAMBIOS') {
    thing.innerText = 'EDITAR MIS DATOS'
  };
};
