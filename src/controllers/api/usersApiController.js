const db = require('../../database/models')

const usersApiController = {
  list: async (req, res) => {
    const currentUrl = res.locals.currentUrl
    let warning = null
    const allUsers = await db.User.findAll()
    try {
      const realParam = parseInt(req.params.id)
      let offset = 0
      const limit = 6
      if (realParam) {
        offset = (realParam - 1) * limit
        if (realParam < 1) {
          offset = 0
          warning = 'BAD REQUEST ::: Showing first entries within the limit (multiplier) of 6 (twelve). MIN OFFSET (0 || > 1) has been breached.'
        };
        const allUsersLength = allUsers.length
        if (Math.ceil(allUsersLength / limit) < realParam) {
          offset = (Math.ceil(allUsersLength / limit) - 1) * limit
          warning = 'BAD REQUEST ::: Showing last entries within the limit (multiplier) of 6 (twelve). MAX OFFSET has been breached. No further entries in DB to show.'
        };
      };
      let twelveUsers = await db.User.findAll({
        limit,
        offset
      })
      try {
        twelveUsers = twelveUsers.map(user => {
          user = {
            id: user.dataValues.id,
            name: user.dataValues.name,
            surname: user.dataValues.surname,
            avatar: `${currentUrl}/img/users/` + user.dataValues.avatar,
            url: `${currentUrl}/api/users/detail/` + user.dataValues.id
          }
          return user
        })
        res.status(200).json({
          status: 200,
          warning,
          users: twelveUsers
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

  lastUser: (req, res) => {
    const currentUrl = res.locals.currentUrl
    db.User.findOne({
      order: [
        ['id', 'DESC']
      ]
    })
      .then(user => {
        user = {
          identity: 'USUARIO',
          id: user.id,
          title: user.name + ' ' + user.surname,
          img: `${currentUrl}/img/users/` + user.avatar
        }
        res.status(200).json({
          stauts: 200,
          user
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 500,
          err
        })
      })
  },

  oneUser: (req, res) => {
    const currentUrl = res.locals.currentUrl
    db.User.findByPk(req.params.id)
      .then(user => {
        user = {
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          avatar: `${currentUrl}/img/users/` + user.avatar,
          newsletter: user.newsletter
        }
        res.status(200).json({
          stauts: 200,
          user
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
  freeEmail: async (req, res) => {
    const checkUser = await db.User.findOne({
      where: {
        email: req.body.email
      }
    })
    try {
      if (!checkUser) {
        res.status(200).json({
          result: true,
          status: 200,
          msg: 'Available'
        })
      } else {
        res.status(200).json({
          result: false,
          status: 200,
          msg: 'El e-mail ya está en uso'
        })
      };
    } catch (err) {
      throw new Error(err)
    };
  },

  // para validación del front
  checkEmail: async (req, res) => {
    const checkUser = await db.User.findOne({
      where: {
        email: req.body.email
      }
    })
    try {
      if (!checkUser) {
        res.status(200).json({
          result: false,
          status: 200,
          msg: 'Revisá tu e-mail'
        })
      } else {
        res.status(200).json({
          result: true,
          satuts: 200,
          msg: 'OK'
        })
      };
    } catch (err) {
      throw new Error(err)
    };
  }
}

module.exports = usersApiController
