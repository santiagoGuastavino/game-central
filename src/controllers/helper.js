const fs = require('fs')
const path = require('path')

const helper = {
  readJson (fileDotJson) {
    const dataPath = path.join(
      __dirname, '/../data'
    )
    const dataFile = fs.readFileSync(
      dataPath + '/' + fileDotJson,
      'UTF-8'
    )
    const data = JSON.parse(dataFile)
    return data
  },

  addOne (n) {
    n++
    return n
  },

  giveNumber (s) {
    const n = parseInt(s)
    return n
  }
}

module.exports = helper
