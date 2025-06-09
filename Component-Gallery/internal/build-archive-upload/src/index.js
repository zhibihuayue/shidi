const shell = require('shelljs')
const path = require('path')
const fs = require('fs')
const args = process.argv.slice(2)
let archiveArgs = args
const projectPath = path.resolve(__dirname, '..', '..', '..')
shell.cd(projectPath)
const comps = shell.ls('packages/components')
const existsAll = archiveArgs.every((item) => comps.includes(item))

const copyDir = (src, dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest)
  }
  const files = fs.readdirSync(src)
  files.forEach((file) => {
    const srcPath = path.join(src, file)
    const destPath = path.join(dest, file)

    if (fs.statSync(srcPath).isDirectory()) {
      if (file !== 'node_modules') {
        copyDir(srcPath, destPath)
      }
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  })
}

const ensureFolder = (targetDir, folderName) => {
  const folderPath = path.join(targetDir, folderName)
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  if (fs.existsSync(folderPath)) {
    shell.rm('-rf', `${folderPath}/*`)
    console.log(`${folderName} has been cleared.`)
  } else {
    fs.mkdirSync(folderPath)
    console.log(`${folderName} has been created.`)
  }
}

if (existsAll) {
  ensureFolder('internal/build-archive-upload', 'output')
  archiveArgs.forEach((arg) => {
    copyDir(
      `packages/components/${arg}`,
      `internal/build-archive-upload/output/${arg}`
    )
  })
  shell.cd('internal/build-archive-upload')
  shell.ls('output').forEach((file) => {
    shell.cd('output')
    if (process.platform === 'win32') {
      const { stderr } = shell.exec('where 7z.exe')
      if (stderr) {
        console.error(
          '7z.exe is not installed or not added to the system PATH variable.'
        )
        return
      }
      shell.exec(`7z.exe a -tzip ${file}.zip ${file}`)
    } else {
      shell.exec(`zip -r ${file}.zip ${file}`)
    }
    shell.cd('..')
  })
}
