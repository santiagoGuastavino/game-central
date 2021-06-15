let { readJson, percentageFinder } = require('./helper');

let title = '';
let products = readJson('products.json');

products.forEach(product => {
    if (product.discount === true) {
        product.finalPrice = percentageFinder(product.price,product.discountRate)
    };
});
let inOffer = products.filter(product => {
    return product.discount == true;
});
let relevant = products.filter(product => {
    return product.relevant == true;
});

let mainController = {
    index: (req, res) => {
        title = 'Game Central';
        res.render('index', { title, inOffer, relevant } );
    },
    
    termsConditions: (req,res) => {
        title = 'Términos & Condiciones';
        res.render('terms-conditions', { title } );
    },
};

module.exports = mainController;