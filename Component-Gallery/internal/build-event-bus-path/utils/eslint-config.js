const { ESLint } = require('eslint')
const path = require('path')

const engine = new ESLint({
  fix: true,
  useEslintrc: false,
  baseConfig: require(path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '.eslintrc.cjs'
  ))
})

module.exports = {
  engine
}
