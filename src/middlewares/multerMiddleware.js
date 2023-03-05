const multer = require('multer')
const path = require('path')

const productDestination = path.join(__dirname, '/../../public/img/products')
const userAvatarDestination = path.join(__dirname, '/../../public/img/users')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { fieldname } = file
    if (fieldname === 'avatar') {
      cb(null, userAvatarDestination)
    } else {
      cb(null, productDestination)
    };
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

module.exports = upload
