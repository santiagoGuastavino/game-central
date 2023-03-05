const adminMiddleware = (req, res, next) => {
  if (req.session.loggedUser && req.session.loggedUser.admin === 1) {
    return next()
  };
  res.redirect('/')
}

module.exports = adminMiddleware
