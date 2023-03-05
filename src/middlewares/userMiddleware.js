const userMiddleware = (req, res, next) => {
  if (!req.session.loggedUser) {
    return res.redirect('/users/login')
  };
  next()
}

module.exports = userMiddleware
