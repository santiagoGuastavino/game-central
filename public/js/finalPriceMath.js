const newPrice = document.querySelectorAll('.new-price-math')
for (let i = 0; i < newPrice.length; i++) {
  const number = newPrice[i].innerHTML
  const roundedNumber = Math.floor(number)
  newPrice[i].innerHTML = `$${roundedNumber}.00`
};
