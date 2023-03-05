const urlMiddleware = (req, res, next) => {
  res.locals.currentUrl = req.protocol + '://' + req.get('host')
  next()
}

module.exports = urlMiddleware
