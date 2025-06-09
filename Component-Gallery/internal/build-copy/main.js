const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const chalk = require('chalk')
const dsitName = '@ct'

shell.cd(path.resolve(__dirname, '..', '..'))
shell.rm('-rf', `${dsitName}`)
shell.exec(`tar -xf ${dsitName}.zip`)
shell.cd(path.resolve(__dirname, '..', '..', 'node_modules'))
shell.rm('-rf', `${dsitName}`)

try {
  fs.cp(
    path.resolve(__dirname, '..', '..', dsitName),
    path.resolve(__dirname, '..', '..', 'node_modules', dsitName),
    { recursive: true },
    (err) => {
      if (err) {
        throw err
      }
      console.log(`COPY path @ct ${chalk.green('success!')}`)
    }
  )
} catch (error) {}
