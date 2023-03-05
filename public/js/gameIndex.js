// // CAPTURO ELEMENTOS DE LA BARRA DE BÚSQUEDA
// let searchBox = document.querySelector('.search-bar-box');
// let searchBar = document.querySelector('.search-bar');
// let searchButton = document.querySelector('.search-button');

// searchBox.addEventListener('mouseenter', () => {
//     searchBar.classList.add('search-button-hover-me');
//     searchButton.classList.add('search-button-hover-me');
// });

// searchBox.addEventListener('mouseout', () => {
//     searchBar.classList.remove('search-button-hover-me');
//     searchButton.classList.remove('search-button-hover-me');
// });

// searchBox.addEventListener('mouseover', () => {
//     searchBar.classList.add('search-button-hover-me');
//     searchButton.classList.add('search-button-hover-me');
// });
// // CAPTURO ELEMENTOS DE LA BARRA DE BÚSQUEDA

// codigo para buscador en vivo (filtro)

// let games = document.querySelectorAll('.unit-product');
// let userInput = '';

// searchBar.addEventListener('input', () => {
//     let userInput = searchBar.value.toUpperCase();
//     for (let game of games) {
//         game.style.display = 'none'
//     }
//     for (let game of games) {
//         if (game.id.includes(userInput)) {
//             game.style.display = 'block';
//         } else {
//             game.style.display = 'none'
//         };
//     };
// });

// acá voy a programar para poner límites visuales al páginado.
// desde el back ya estoy prohibiendo ir al 0 y mando un error
// si el cliente fuerza un paginado mayor a mi cantidad de productos.
// acá voy a armar prevent defaults etc limitando esas opciones.

// ambos formularios
// acá uso una función para determinar el hostname, puede ser el localhost durante desarrollo o algún servidor en internet.
import { getCurrentUrl } from './utils/helper.js'

const pageBack = document.querySelector('#page-back')
const pageForward = document.querySelector('#page-forward')

// ambos botones
const buttonBack = document.querySelector('#submit-back')
const buttonForward = document.querySelector('#submit-forward')

// el pathname con el que voy a trabajar
const pathName = window.location.pathname

// si no hay nada después de /products, checkeo que no sea 1 y deshabilito el botón para restar el paginado
if (pathName.length === 9 || pathName.includes('1')) {
  buttonBack.classList.add('change-page-button-disable')
  pageBack.addEventListener('submit', (e) => {
    e.preventDefault()
  })
};
const currentUrl = getCurrentUrl()

// si el pathName tiene algo más que /products, voy a almacenar el número del mismo, es decir, el parámetro y desde ahí evalúo hasta donde dejo sumar página
if (pathName.length > 9) {
  // regex para extraer número y lo hago INT
  const param = parseInt(pathName.match(/\d+/)[0])
  // limit es la cantidad máxima de juegos que muestro por vista
  const limit = 4
  // consulto a éste endpoint la cantidad de juegos
  fetch(`${currentUrl}/api`)
    .then(res => res.json())
    .then(data => {
      const allGamesLength = data.totals.gameCount

      if (Math.ceil(allGamesLength / limit) === param) {
        buttonForward.classList.add('change-page-button-disable')
        pageForward.addEventListener('submit', (e) => {
          e.preventDefault()
        })
      };
    })
    .catch(err => console.log(err))
};
