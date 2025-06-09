const fs = require('fs')
const { engine } = require('./eslint-config')
const writFile = async (path, data) => {
  const report = await engine.lintText(data)
  fs.writeFileSync(`${path}`, report[0].output)
}

module.exports = {
  writFile
}
