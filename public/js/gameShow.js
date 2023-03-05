// Con éste código capturo la descripción que va abajo del header
// y la acorto, para que no quede una pared de texto.
const shortenDescription = document.querySelector('#shorten-description')

const shortText = shortenDescription.innerHTML.substring(0, 175)
shortenDescription.innerHTML = shortText + '...'

// acá programo para que me haga la cuenta matemática del precio final
const newPrice = document.querySelectorAll('.new-price-math')
for (let i = 0; i < newPrice.length; i++) {
  const number = newPrice[i].innerHTML
  const roundedNumber = Math.floor(number)
  newPrice[i].innerHTML = `$${roundedNumber}.00`
};

// acá programo para dar el resultado de $$$ ahorrado
const savedMoneyMath = document.querySelector('.saved-money-math')
if (savedMoneyMath) {
  const price = parseInt(savedMoneyMath.children[0].innerHTML)
  const discount = parseInt(savedMoneyMath.children[1].innerHTML)
  function math (n1, n2) {
    const multiplier = n1 * n2
    const division = multiplier / 100
    const result = n1 - division
    const saved = n1 - result
    return Math.floor(saved)
  };
  savedMoneyMath.innerHTML = `AHORRAS $${math(price, discount)}!`
};
