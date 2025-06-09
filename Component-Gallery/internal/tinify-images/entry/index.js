const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { isImage, isImages, isSvgGif } = require("../shared/mageShared");
const ora = require("ora");
const { tinify_key } = require("../constant/key");
const tinify = require("tinify");
const ProgressBar = require("progress"); // Import the progress package
const spinner = ora("🤯 compress start \n");
const { loggerError } = require("../utils/logger");
tinify.key = tinify_key;

const compressImagesInFolder = async (folder) => {
  spinner.start();
  spinner.color = "yellow";
  spinner.text = "🐱tinify compress .... ";
  const allFiles = getAllFiles(folder);
  const imageFiles = allFiles.filter((file) => isImage(file));

  if (imageFiles.length === 0) {
    console.log("No images found to compress.");
    return;
  }

  const bar = new ProgressBar("[:bar] :percent \n", {
    total: imageFiles.length,
    width: 40,
  });

  await copyDir(folder, `${folder}_compress`, bar);
};
const getAllFiles = (dirPath, arrayOfFiles = []) => {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });
  return arrayOfFiles;
};


const copyDir = async (src, dest, bar) => {
  try {
    createDirectory(dest);
    const files = fs.readdirSync(src);
    for (let file of files) {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      if (fs.lstatSync(srcPath).isDirectory()) {
        await copyDir(srcPath, destPath, bar);
      } else if (isImage(file)) {
        await compressAndCopyImage(srcPath, destPath, bar);
      } else {
        copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    handleError(src, err);
  }
};

const createDirectory = (dest) => {
  fs.mkdirSync(dest, { recursive: true });
};

const compressAndCopyImage = async (srcPath, destPath, bar) => {
  spinner.color = "blue";
  spinner.text = `compressing "${srcPath}"`;
  const source = tinify.fromFile(srcPath);
  const outputPath = path.join(path.dirname(destPath), path.basename(srcPath));
  await new Promise((resolve, reject) => {
    source.toFile(outputPath, (err) => {
      if (err) {
        reject(err);
      } else {
        bar.tick();
        resolve();
      }
    });
  });
};

const copyFile = (srcPath, destPath) => {
  fs.copyFileSync(srcPath, destPath);
};

const handleError = (src, err) => {
  console.error(`Error processing folder ${src}:`, err);
  throw new Error(err);
};

const keyValidate = () => {
  return new Promise((resolve, reject) => {
    tinify.validate(function (err, data) {
      if (err) {
        reject(err);
      }
      resolve({
        validated: true,
      });
    });
  });
};
const startCompression = async (filePath, replPath) => {
  spinner.succeed(`1: 🚀 图片资源指定路径: ${replPath}`);
  spinner.succeed(`2: 🚗 压缩后图片资源存放路径: ${replPath}_compress`);
  spinner.succeed(`3: 🚙 validating tinify key start ...`);
  try {
    const { validated } = await keyValidate();
    if (!validated) {
      spinner.fail(chalk.red("🚫 tinify key 无效 \n"));
      return null;
    }
    spinner.succeed(`4: 👍 validate tinify key successfully ...`);
    const isExist = await isImages(filePath);
    if (!isExist) {
      spinner.fail(chalk.red("🚫 路径图片资源为空!"));
      return;
    }
    const { exist, files } = await isSvgGif(filePath);
    if (!exist) {
      await compressImagesInFolder(filePath);
      spinner.succeed(chalk.green("🎇 tinify completed"));
      return null;
    }
    spinner.stop();
    loggerError("🚫 ... .svg .gif 格式暂不支持, 不能处理的图片 \n[");
    loggerError(`${files.join(",\n")}`);
    loggerError("]");
  } catch (err) {
    spinner.fail(chalk.red(`tinify failed: ${err}`));
  }
};

module.exports = {
  startCompression,
};

