const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const db = require('../database/models')

const usersController = {
  // GET: show register view // <form>
  // FALTA MOSTRAR countries de la API rest
  register: (req, res) => {
    res.render('./users/register', {
      title: 'Crea tu cuenta'
    })
  },

  // POST: process register // store user in DB
  // FALTA countries de la API rest países: req.body.country
  processRegister: async (req, res) => {
    const oldData = req.body
    const validations = validationResult(req)
    // busco un usuario por email
    const user = await db.User.findOne({
      where: {
        email: req.body.email
      }
    })
    try {
      if (user) {
        // si encontré coincidencia con el email, envío un error más
        validations.errors.push({
          param: 'email',
          msg: 'El e-mail ya está en uso'
        })
      };
      if (validations.errors.length > 0) {
        // si hay errores los mando a la vista
        res.render('./users/register', {
          title: 'Crea tu cuenta',
          oldData,
          errors: validations.mapped()
        })
      } else {
        // si no hay errores, creo el usuario
        return db.User.create({
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10),
          avatar: req.file.filename,
          newsletter: req.body.newsletter
        })
          .then(() => {
            res.redirect('/users/login')
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

  // GET: show login view
  login: (req, res) => {
    res.render('./users/login', {
      title: 'Ingresa'
    })
  },

  // POST: process login
  processLogin: async (req, res) => {
    const email = req.body.email
    const validations = validationResult(req)
    const userToLog = await db.User.findOne({
      where: {
        email
      }
    })
    try {
      if (!userToLog) {
        // si el email no coincide con ninguno en la db
        validations.errors.push({
          param: 'email',
          msg: 'Revisá tu e-mail'
        })
      };
      if (!userToLog && req.body.password) {
        // si el email no coincide y se ingresa una password
        validations.errors.push({
          param: 'password',
          msg: 'No pudimos validar tu contraseña'
        })
      };
      if (userToLog && req.body.password) {
        // si encontré usuario y se ingresó una contraseña
        const passwordMatch = bcrypt.compareSync(
          req.body.password, userToLog.password
        )
        if (!passwordMatch) {
          // si no conciden las password, envío un error más
          validations.errors.push({
            param: 'password',
            msg: 'Las credenciales no coinciden'
          })
        };
      };
      if (validations.errors.length > 0) {
        // hay errores: los mando a la vista
        return res.render('./users/login', {
          title: 'Ingresa',
          email,
          errors: validations.mapped()
        })
      } else {
        // no hay errores: logeo el usuario
        delete userToLog.password
        req.session.loggedUser = userToLog
        if (req.body.remember) {
          // si eligen "recordarme"
          res.cookie(
            'userEmail',
            email,
            {
              maxAge: (((1000 * 60) * 60) * 24) * 30
            }
          )
        };
        // elijan o no "recordarme", lo úlitmo que hago es redirijir:
        return res.redirect('/users/profile')
      };
    } catch (err) {
      res.status(500).render('error', {
        status: 500,
        title: 'ERROR',
        errorDetail: err
      })
    };
  },

  // GET: show users/:id view
  show: (req, res) => {
    const dashboardLink = process.env.DASHBOARD_URL
    const user = req.session.loggedUser
    db.User.findByPk(user.id, {
      include: [
        'games'
      ]
    })
      .then(loggedUser => {
        res.render('./users/profile', {
          title: loggedUser.name + ' ' + loggedUser.surname,
          user: loggedUser,
          dashboardLink
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

  // GET: destroy session & cookie
  delog: async (req, res) => {
    await req.session.destroy()
    await res.clearCookie('userEmail')
    try {
      res.redirect('/')
    } catch (err) {
      res.status(500).render('error', {
        status: 500,
        title: 'ERROR',
        errorDetail: err
      })
    };
  },

  // GET: show user list
  index: (req, res) => {
    db.User.findAll()
      .then(users => {
        res.render('./users/index', {
          title: 'Usuarios',
          users
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

  // PUT: submit changes to user
  update: async (req, res) => {
    // edito el usuario
    if (req.file !== undefined) {
      // si hay cambios en la imágen
      await db.User.update({
        name: req.body.name,
        surname: req.body.surname,
        avatar: req.file.filename,
        newsletter: req.body.newsletter
      }, {
        where: {
          id: req.session.loggedUser.id
        }
      })
    } else {
      // si no hay cambios en la imágen
      await db.User.update({
        name: req.body.name,
        surname: req.body.surname,
        newsletter: req.body.newsletter
      }, {
        where: {
          id: req.session.loggedUser.id
        }
      })
    };

    // cuando haga todo lo anterior:
    try {
      res.redirect('/users/profile')
    } catch (err) {
      res.status(500).render('error', {
        status: 500,
        title: 'ERROR',
        errorDetail: err
      })
    };
  },

  // DELETE: remove entry
  destroy: (req, res) => {
    db.User.findOne({
      where: {
        id: req.session.loggedUser.id
      }
    })
      .then(user => {
        if (user.email !== 'admin') {
          db.UserGame.destroy({
            where: {
              userId: user.id
            }
          })
          return user
        } else {
          throw new Error('Unauthorized: FORBIDDEN')
        };
      })
      .then(user => {
        db.User.destroy({
          where: {
            id: user.id
          }
        })
      })
      .then(async () => {
        await req.session.destroy()
        await res.clearCookie('userEmail')
        try {
          res.redirect('/')
        } catch (err) {
          res.status(500).render('error', {
            status: 500,
            title: 'ERROR',
            errorDetail: err
          })
        };
      })
      .catch(err => {
        res.status(500).render('error', {
          status: 500,
          title: 'ERROR',
          errorDetail: err
        })
      })
  }

  // GET: show <form> to change or not admin
  /*
  admin: (req, res) => {
    // esto vuela pronto, cuando termine el update vengo para acá
    // let users = readJson('users.json');
    const param = req.params.id
    users.forEach(user => {
      if (param === user.id) {
        res.render('./users/give-admin', {
          title: 'Privilegios',
          user
        })
      };
    })
  },

  // PUT: changes user admin status (true || false)
  giveAdmin: (req, res) => {
    // esto vuela pronto, cuando termine el update vengo para acá
    // let users = readJson('users.json');
    const param = req.params.id
    users.forEach(user => {
      if (param === user.id) {
        user.admin = storeBool(req.body.admin)
        writeJson(users, 'users')
        return res.redirect('/users')
      };
    })
  }
  */
}

module.exports = usersController
