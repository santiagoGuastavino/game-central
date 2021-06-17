let path = require('path');
let fs = require('fs');

let jsonPath = path.join(__dirname + '/..' + '/data' + '/');

let helper = {
    lastId: (data) => {
        let last = 0;
        data.forEach(item => {
            if (last < item.id) {
                last = item.id;
            };
        });
        return last;
    },

    readJson: (jsonName) => {
        let jsonFile = fs.readFileSync(jsonPath + jsonName,'UTF-8');
        let data = JSON.parse(jsonFile);
        return data;
    },
    
    writeJson: (array,nombre) => {
        array = JSON.stringify(array, null, 4);
        fs.writeFileSync(jsonPath + nombre + '.json', array);
    },

    storeBool: (value) => {
        if (value == 'true') {
            return true;
        } else {
            return false;
        };
    },

    percentageFinder: (price,discountRate) => {
        let multiplier = (price * discountRate);
        let divider = (multiplier / 100);
        let result = (price - divider);
        let roundResult = Math.floor(result);
        return roundResult;
    },

    // HOW?? -> PERCENTAGE FINDER IS NOT A FUNCTION
    inOfferHandler: (products) => {
        products.forEach(product => {
            if (product.inOffer == true) {
                product.finalPrice = this.percentageFinder(product.price,product.discount);
            } else {
                product.finalPrice = null;
                product.discount = null;
            };
        });
        this.writeJson(products, 'products');
    },

    toUpper: (item) => {
        return item.toUpperCase();
    },

    // HOW?? -> PARAM IS NOT DEFINED
    paramFinder: () => {
        param = req.params.id;
        return param;
    },
};

module.exports = helper;