let { stringOrNull, addOne, giveNumber } = require('./helper');

let db = require('../database/models');

let productsController = {
    // 0 GET: carrito
    // ¡LISTO POR SEQUELIZE!
    cart: (req,res) => {
        db.Game.findAll({
            include: [
                'status',
                'platforms'
            ]
        })
            .then(games => {
                res.render('./products/cart', {
                    title: 'Carrito de compras',
                    games
                });
            })
            .catch(err => {
                res.status(500).render('error', {
                    status: 500,
                    title: 'ERROR',
                    errorDetail: err
                });
            });
    },

    // 1 GET: show all items
    // ¡LISTO POR SEQUELIZE!
    index: (req,res) => {
        db.Game.findAll({
            include: [
                'status'
            ]
        })
            .then(games => {
                res.render('./products/index', {
                    title: 'Todos los títulos',
                    games
                });
            })
            .catch(err => {
                res.status(500).render('error', {
                    status: 500,
                    title: 'ERROR',
                    errorDetail: err
                });
            });
    },

    // 2 GET: show product <form>
    // ¡LISTO POR SEQUELIZE!
    create: async (req,res) => {
        let categories = await db.Category.findAll();
        try {
            res.render('./products/create', {
                title: 'Nuevo producto',
                categories
            });
        } catch(err) {
            res.status(500).render('error', {
                status: 500,
                title: 'ERROR',
                errorDetail: err
            });
        };
    },

    // 3 GET: show product detail
    // ¡LISTO POR SEQUELIZE!
    show: async (req,res) => {
        let game = await db.Game.findByPk(req.params.id, {
            include: [
                'categories',
                'platforms',
                'status'
            ]
        });
        try {
            res.render('./products/show', {
                title: game.title,
                game
            });
        } catch(err) {
            res.status(500).render('error', {
                status: 500,
                title: 'ERROR',
                errorDetail: err
            });
        };
    },

    // 4 POST: store product <form> fields
    // ¡LISTO POR SEQUELIZE!
    store: (req,res) => {
        db.Game.create({
            title: req.body.title.toUpperCase(),
            img: req.file.filename,
            price: parseFloat(req.body.price),
            discount: req.body.discount,
            description: req.body.description
        })
            .then(creation => {
                if (Array.isArray(req.body.platforms)) {
                    let platforms = req.body.platforms.map(giveNumber);
                    platforms = platforms.map(addOne);
                    platforms.forEach(platform => {
                        db.PlatformGame.create({
                            gameId: creation.id,
                            platformId: platform
                        });
                    });
                } else {
                    let platform = parseInt(req.body.platforms);
                    platform ++;
                    db.PlatformGame.create({
                        gameId: creation.id,
                        platformId: platform
                    });
                };
                return creation;
            })
            .then(creation => {
                let categories = req.body.categories.map(addOne);
                categories.forEach(category => {         
                    db.CategoryGame.create({
                        gameId: creation.id,
                        categoryId: category
                    });
                });
                return creation;
            })
            .then(creation => {
                let relevant = req.body.relevant;
                let offer = req.body.offer;
                if (relevant === 'true' && offer === 'true') {
                    let status = [1,2];
                    return status.forEach(status => {
                        db.StatusGame.create({
                            gameId: creation.id,
                            statusId: status
                        });
                    });
                };
                if (relevant === 'true' && offer != 'true') {
                    return db.StatusGame.create({
                        gameId: creation.id,
                        statusId: 1
                    });
                };
                if (relevant != 'true' && offer === 'true') {
                    return db.StatusGame.create({
                        gameId: creation.id,
                        statusId: 2
                    });
                };
            })
            .then(() => {
                res.redirect('/products');
            })
            .catch(err => {
                res.status(500).render('error', {
                    status: 500,
                    title: 'ERROR',
                    errorDetail: err
                });
            });
    },

    // 5 GET: show <form> with current product data
    // ¡LISTO POR SEQUELIZE!
    edit: async (req,res) => {
        let oldCategories = await db.Category.findAll();
        let editableGame = await db.Game.findByPk(req.params.id, {
            include: [
                'categories',
                'platforms',
                'status'
            ]
        });
        try {
            res.render('./products/edit', {
                title: 'Edicion de producto',
                editableGame,
                oldCategories
            });
        } catch(err) {
            res.status(500).render('error', {
                status: 500,
                title: 'ERROR',
                errorDetail: err
            });
        };
    },

    // 6 POST: submit changes to existing product
    // ¡LISTO POR SEQUELIZE!
    update: (req,res) => {
        db.Game.update({
            title: req.body.title.toUpperCase(),
            img: req.file.filename,
            price: parseFloat(req.body.price),
            discount: req.body.discount,
            description: req.body.description
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(async () => {
            let platforms = await req.body.platforms;
            let platformGameDelete = await db.PlatformGame.destroy({
                where: {
                    gameId: req.params.id
                }
            });
            try {
                if (Array.isArray(platforms)) {
                    platforms = platforms.map(giveNumber);
                    platforms = platforms.map(addOne);
                    platforms.forEach(platform => {
                        db.PlatformGame.create({
                            gameId: req.params.id,
                            platformId: platform
                        });
                    });
                } else {
                    let platform = parseInt(platforms);
                    platform ++;
                    db.PlatformGame.create({
                        gameId: req.params.id,
                        platformId: platform
                    });
                };
            } catch(err) {
                res.status(500).render('error', {
                    status: 500,
                    title: 'ERROR',
                    errorDetail: err
                });
            };
        })
        .then(async () => {
            let categories = await req.body.categories;
            let categoryGameDelete = await db.CategoryGame.destroy({
                where: {
                    gameId: req.params.id
                }
            });
            try {
                categories = categories.map(addOne);
                categories.forEach(category => {         
                    db.CategoryGame.create({
                        gameId: req.params.id,
                        categoryId: category
                    });
                });
            } catch(err) {
                res.status(500).render('error', {
                    status: 500,
                    title: 'ERROR',
                    errorDetail: err
                });
            };
        })
        .then(async () => {
            let relevant = await req.body.relevant;
            let offer = await req.body.offer;
            let statusGameDelete = await db.StatusGame.destroy({
                where: {
                    gameId: req.params.id
                }
            });
            try {
                if (relevant === 'true' && offer === 'true') {
                    let status = [1,2];
                    return status.forEach(status => {
                        db.StatusGame.create({
                            gameId: req.params.id,
                            statusId: status
                        });
                    });
                };
                if (relevant === 'true' && offer != 'true') {
                    return db.StatusGame.create({
                        gameId: req.params.id,
                        statusId: 1
                    });
                };
                if (relevant != 'true' && offer === 'true') {
                    return db.StatusGame.create({
                        gameId: req.params.id,
                        statusId: 2
                    });
                };
            } catch(err) {
                res.status(500).render('error', {
                    status: 500,
                    title: 'ERROR',
                    errorDetail: err
                });
            };
        })
        .then(() => {
            res.redirect('/products/' + req.params.id);
        })
        .catch(err => {
            res.status(500).render('error', {
                status: 500,
                title: 'ERROR',
                errorDetail: err
            });
        });
    },

    // 7 DELETE: remove entry
    // ¡LISTO POR SEQUELIZE!
    destroy: (req,res) => {
        db.Game.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(() => {
                res.redirect('/products');
            })
            .catch(err => {
                res.status(500).render('error', {
                    status: 500,
                    title: 'ERROR',
                    errorDetail: err
                });
            });
    },
};

module.exports = productsController;