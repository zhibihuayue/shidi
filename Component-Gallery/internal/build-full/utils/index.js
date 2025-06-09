const sha256 = require('crypto-js/sha256')
 const fileContentHash = (data, length = 8) => {
  const hash = sha256(data).toString()
  return hash.substring(0, length)
}

module.exports = {
  fileContentHash
}
