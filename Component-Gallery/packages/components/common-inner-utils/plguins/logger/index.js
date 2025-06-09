// 日志插件
const logger = (aString, aVersion, aLColor, aRColor) => {
  const VERSION = aVersion || '1.0.0'
  const leftStyle = `background:${
    aLColor || '#606060'
  }; color: #fff; border-radius: 3px 0 0 3px;padding: 5px;`
  const rightStyle = `background: ${
    aRColor || '#1475B2'
  }; color: #fff; border-radius: 0 3px 3px 0;padding: 5px;`
  console.log(`%c ${aString} %c ${VERSION} `, leftStyle, rightStyle)
}

export default logger
