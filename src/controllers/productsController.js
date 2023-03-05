const {
  addOne,
  giveNumber
} = require('./helper')
const db = require('../database/models')
const { validationResult } = require('express-validator')

const productsController = {
  // 0 GET: carrito
  cart: (req, res) => {
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
        })
      })
      .catch(err => {
        res.status(500).render('error', {
          status: 500,
          title: 'ERROR',
          errorDetail: err
        })
      })
  },

  // 1 GET: show all items
  index: async (req, res) => {
    let realParam = parseInt(req.params.id)
    let offset = 0
    const limit = 4
    const allGames = await db.Game.findAll()
    try {
      if (realParam) {
        offset = (realParam - 1) * 4
        if (realParam < 1) {
          throw new Error('Request Range Not Satisfiable')
        };
        const allGamesLength = allGames.length
        if (Math.ceil(allGamesLength / limit) < realParam) {
          throw new Error('Request Range Not Satisfiable')
        };
      } else {
        realParam = 1
      };
      const fourGames = await db.Game.findAll({
        limit,
        offset,
        include: [
          'status'
        ]
      })
      try {
        res.render('./products/index', {
          title: 'Todos los títulos',
          games: fourGames,
          realParam
        })
      } catch (err) {
        res.status(416).render('error', {
          status: 416,
          title: 'ERROR',
          errorDetail: err
        })
      };
    } catch (err) {
      res.status(416).render('error', {
        status: 416,
        title: 'ERROR',
        errorDetail: err
      })
    };
  },

  // 1.5 GET: resultados de búsqueda
  // results: (req,res) => {
  //     res.send({
  //         ...req
  //     })
  // },

  // 2 GET: show product <form>
  create: async (req, res) => {
    const categories = await db.Category.findAll()
    try {
      res.render('./products/create', {
        title: 'Nuevo producto',
        categories
      })
    } catch (err) {
      res.status(500).render('error', {
        status: 500,
        title: 'ERROR',
        errorDetail: err
      })
    };
  },

  // 3 GET: show product detail
  show: async (req, res) => {
    const game = await db.Game.findByPk(req.params.id, {
      include: [
        'categories',
        'platforms',
        'status'
      ]
    })
    try {
      res.render('./products/show', {
        title: game.title,
        game
      })
    } catch (err) {
      res.status(500).render('error', {
        status: 500,
        title: 'ERROR',
        errorDetail: err
      })
    };
  },

  // 4 POST: store product <form> fields // create new product
  store: async (req, res) => {
    const oldData = req.body
    const validations = validationResult(req)
    const categories = await db.Category.findAll()
    // busco un juego por título
    const game = await db.Game.findOne({
      where: {
        title: req.body.title.toUpperCase()
      }
    })
    try {
      if (validations.errors.length > 0) {
        // si hay errores los mando a la vista
        if (game) {
          // si encontré coincidencia en el nombre, envío un error más
          validations.errors.push({
            param: 'title',
            msg: 'El título ingresado ya existe en nuestra base de datos'
          })
        };
        return res.render('./products/create', {
          title: 'Nuevo producto',
          categories,
          oldData,
          errors: validations.mapped()
        })
      } else {
        // si no hay errores, creo el juego
        db.Game.create({
          title: req.body.title.toUpperCase(),
          img: req.file.filename,
          price: parseFloat(req.body.price),
          discount: req.body.discount,
          description: req.body.description
        })
          .then(creation => {
            if (Array.isArray(req.body.platforms)) {
              let platforms = req.body.platforms.map(giveNumber)
              platforms = platforms.map(addOne)
              platforms.forEach(platform => {
                db.PlatformGame.create({
                  gameId: creation.id,
                  platformId: platform
                })
              })
            } else {
              let platform = parseInt(req.body.platforms)
              platform++
              db.PlatformGame.create({
                gameId: creation.id,
                platformId: platform
              })
            };
            return creation
          })
          .then(creation => {
            const categories = req.body.categories.map(addOne)
            categories.forEach(category => {
              db.CategoryGame.create({
                gameId: creation.id,
                categoryId: category
              })
            })
            return creation
          })
          .then(creation => {
            const relevant = req.body.relevant
            const offer = req.body.offer
            if (relevant === 'true' && offer === 'true') {
              const status = [1, 2]
              return status.forEach(status => {
                db.StatusGame.create({
                  gameId: creation.id,
                  statusId: status
                })
              })
            };
            if (relevant === 'true' && offer !== 'true') {
              return db.StatusGame.create({
                gameId: creation.id,
                statusId: 1
              })
            };
            if (relevant !== 'true' && offer === 'true') {
              return db.StatusGame.create({
                gameId: creation.id,
                statusId: 2
              })
            };
          })
          .then(() => {
            res.redirect('/products')
          })
          .catch(err => {
            res.status(500).render('error', {
              status: 500,
              title: 'ERROR',
              errorDetail: err
            })
          })
      };
    } catch (err) {
      res.status(500).render('error', {
        status: 500,
        title: 'ERROR',
        errorDetail: err
      })
    };
  },

  // 5 GET: show <form> with current product data
  edit: async (req, res) => {
    const categories = await db.Category.findAll()
    const editableGame = await db.Game.findByPk(
      req.params.id, {
        include: [
          'categories',
          'platforms',
          'status'
        ]
      }
    )
    try {
      res.render('./products/edit', {
        title: 'Edicion de producto',
        editableGame,
        categories
      })
    } catch (err) {
      res.status(500).render('error', {
        status: 500,
        title: 'ERROR',
        errorDetail: err
      })
    };
  },

  // 6 POST: submit changes to existing product
  update: async (req, res) => {
    const validations = validationResult(req)

    if (validations.errors.length > 0) {
      const categories = await db.Category.findAll()
      const editableGame = await db.Game.findByPk(
        req.params.id,
        {
          include: [
            'categories',
            'platforms',
            'status'
          ]
        }
      )

      try {
        // si hay errores, los mando a la vista
        return res.render('./products/edit', {
          title: 'Edición de producto',
          editableGame,
          categories,
          errors: validations.mapped()
        })
      } catch (err) {
        res.status(500).render('error', {
          status: 500,
          title: 'ERROR',
          errorDetail: err
        })
      };
    } else {
      // si no hay errores, edito el producto
      if (req.file !== undefined) {
        // si hay cambios en la imágen
        await db.Game.update({
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
      } else {
        // si no hay cambios en la imágen
        await db.Game.update({
          title: req.body.title.toUpperCase(),
          price: parseFloat(req.body.price),
          discount: req.body.discount,
          description: req.body.description
        }, {
          where: {
            id: req.params.id
          }
        })
      };

      // borro las entradas en la pivot plataformas
      await db.PlatformGame.destroy({
        where: {
          gameId: req.params.id
        }
      })

      // creo nuevas entradas en la pivot plataformas
      let platforms = req.body.platforms
      if (Array.isArray(platforms)) {
        platforms = platforms.map(giveNumber)
        platforms = platforms.map(addOne)
        await platforms.forEach(platform => {
          db.PlatformGame.create({
            gameId: req.params.id,
            platformId: platform
          })
        })
      } else {
        let platform = parseInt(platforms)
        platform++
        await db.PlatformGame.create({
          gameId: req.params.id,
          platformId: platform
        })
      };

      // borro las entradas de la pivot categorías
      await db.CategoryGame.destroy({
        where: {
          gameId: req.params.id
        }
      })

      // creo nuevas entradas en la pivot categorías
      let categories = req.body.categories
      categories = categories.map(addOne)
      await categories.forEach(category => {
        db.CategoryGame.create({
          gameId: req.params.id,
          categoryId: category
        })
      })

      // borro las entradas en la pivot status
      await db.StatusGame.destroy({
        where: {
          gameId: req.params.id
        }
      })

      // creo nuevas entradas en la pivot status
      const relevant = req.body.relevant
      const offer = req.body.offer
      if (relevant === 'true' && offer === 'true') {
        const status = [
          1,
          2
        ]
        await status.forEach(status => {
          db.StatusGame.create({
            gameId: req.params.id,
            statusId: status
          })
        })
      } else if (relevant === 'true' && offer !== 'true') {
        await db.StatusGame.create({
          gameId: req.params.id,
          statusId: 1
        })
      } else if (relevant !== 'true' && offer === 'true') {
        await db.StatusGame.create({
          gameId: req.params.id,
          statusId: 2
        })
      };

      // cuando haga todo lo anterior:
      try {
        res.redirect(
          '/products/detail/' + req.params.id
        )
      } catch (err) {
        res.status(500).render('error', {
          status: 500,
          title: 'ERROR',
          errorDetail: err
        })
      };
    };
  },

  // 7 DELETE: remove entry
  destroy: (req, res) => {
    db.Game.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(() => {
        res.redirect('/products')
      })
      .catch(err => {
        res.status(500).render('error', {
          status: 500,
          title: 'ERROR',
          errorDetail: err
        })
      })
  }
}

module.exports = productsController
