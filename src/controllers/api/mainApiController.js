const db = require('../../database/models')

const mainApiController = {
  totals: async (req, res) => {
    const currentUrl = res.locals.currentUrl
    const links = [
            `${currentUrl}/api/users`,
            `${currentUrl}/api/users/last`,
            `${currentUrl}/api/products`,
            `${currentUrl}/api/products/last`
    ]
    let totals = {}
    const gameCount = await db.Game.count()
    const categoryCount = await db.Category.count()
    const platformCount = await db.Platform.count()
    const userCount = await db.User.count()
    const saleCount = await db.UserGame.count()
    try {
      totals = {
        gameCount,
        categoryCount,
        platformCount,
        userCount,
        saleCount
      }
      res.status(200).json({
        status: 200,
        links,
        totals
      })
    } catch (err) {
      res.status(500).json({
        status: 500,
        err
      })
    };
  }
}

module.exports = mainApiController
