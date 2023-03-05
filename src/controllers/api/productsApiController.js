const { sequelize } = require('../../database/models')
const db = require('../../database/models')

const productsApiController = {
  list: async (req, res) => {
    const currentUrl = res.locals.currentUrl
    let warning = null
    const allGames = await db.Game.findAll()
    const countByCategory = await sequelize.query(
      'SELECT COUNT(category_id) as \'quantity\', categories.title AS \'title\' FROM category_game INNER JOIN categories ON categories.id = category_id GROUP BY category_id ORDER BY quantity DESC LIMIT 4', {
        model: db.CategoryGame
      })
    const countByPlatform = await sequelize.query(
      'SELECT COUNT(platform_id) AS \'quantity\', platforms.title AS \'title\' FROM platform_game INNER JOIN platforms ON platforms.id = platform_id GROUP BY platform_id ORDER BY quantity DESC LIMIT 4', {
        model: db.PlatformGame
      })
    const bestBuyers = await sequelize.query(
      'SELECT COUNT(user_id) AS \'quantity\', users.name AS \'name\', users.surname AS \'surname\' FROM user_game  INNER JOIN users ON users.id = user_id WHERE name <> \'admin\' GROUP BY user_id ORDER BY quantity DESC LIMIT 4', {
        model: db.UserGame
      })
    const bestSellers = await sequelize.query(
      'SELECT COUNT(game_id_user) AS \'quantity\', games.title AS \'title\' FROM user_game INNER JOIN games ON games.id = game_id_user GROUP BY game_id_user ORDER BY quantity DESC LIMIT 4', {
        model: db.UserGame
      })
    try {
      const realParam = parseInt(req.params.id)
      let offset = 0
      const limit = 9
      if (realParam) {
        offset = (realParam - 1) * limit
        if (realParam < 1) {
          offset = 0
          warning = 'BAD REQUEST ::: Showing first entries within the limit (multiplier) of 9 (nine). MIN OFFSET (0 || > 1) has been breached.'
        };
        const allGamesLength = allGames.length
        if (Math.ceil(allGamesLength / limit) < realParam) {
          offset = (Math.ceil(allGamesLength / limit) - 1) * limit
          warning = 'BAD REQUEST ::: Showing last entries within the limit (multiplier) of 9 (nine). MAX OFFSET has been breached. No further entries in DB to show.'
        };
      };
      let nineGames = await db.Game.findAll({
        limit,
        offset
      })
      try {
        nineGames = nineGames.map(game => {
          game = {
            id: game.dataValues.id,
            title: game.dataValues.title,
            img: `${currentUrl}/img/products/` + game.dataValues.img,
            url: `${currentUrl}/api/products/detail/` + game.dataValues.id
          }
          return game
        })
        res.status(200).json({
          status: 200,
          warning,
          games: nineGames,
          countByCategory,
          countByPlatform,
          bestBuyers,
          bestSellers
        })
      } catch (err) {
        res.status(500).json({
          status: 500,
          err
        })
      };
    } catch (err) {
      res.status(500).json({
        status: 500,
        err
      })
    };
  },

  lastGame: (req, res) => {
    const currentUrl = res.locals.currentUrl
    db.Game.findOne({
      order: [
        ['id', 'DESC']
      ]
    })
      .then(game => {
        game = {
          identity: 'PRODUCTO',
          id: game.id,
          title: game.title,
          img: `${currentUrl}/img/products/` + game.dataValues.img,
          url: `${currentUrl}/api/products/detail/` + game.dataValues.id
        }
        res.status(200).json({
          status: 200,
          game
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 500,
          err
        })
      })
  },

  oneGame: (req, res) => {
    const currentUrl = res.locals.currentUrl
    db.Game.findByPk(req.params.id, {
      include: [
        'categories',
        'platforms',
        'status'
      ]
    })
      .then(game => {
        const categories = []
        game.categories.forEach(category => {
          categories.push(category.dataValues.title)
        })
        const platforms = []
        game.platforms.forEach(platform => {
          platforms.push(platform.dataValues.title)
        })
        const status = []
        game.status.forEach(statu => {
          status.push(statu.dataValues.name)
        })
        game = {
          id: game.id,
          title: game.title,
          img: `${currentUrl}/img/products/` + game.dataValues.img,
          price: game.price,
          discount: game.discount,
          description: game.description,
          categories,
          platforms,
          status
        }
        res.status(200).json({
          status: 200,
          game
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 500,
          err
        })
      })
  },

  // para validación del front
  freeTitle: async (req, res) => {
    const checkTitle = await db.Game.findOne({
      where: {
        title: req.body.title
      }
    })
    try {
      if (!checkTitle) {
        res.status(200).json({
          result: true,
          status: 200,
          msg: 'Available'
        })
      } else {
        res.status(200).json({
          result: false,
          status: 200,
          msg: 'El título ingresado ya existe en nuestra base de datos'
        })
      };
    } catch (err) {
      throw new Error(err)
    };
  }
}

module.exports = productsApiController
