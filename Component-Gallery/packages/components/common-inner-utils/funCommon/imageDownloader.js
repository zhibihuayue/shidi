import JSZip from 'jszip'

class ImageDownloader {
  constructor(
    images,
    {
      imageNameGenerator,
      isSingleImg,
      zipName,
      watermarkText,
      isWatermarkEnabled
    }
  ) {
    console.log('ImageDownloader constructor')
    this.zip = new JSZip()
    this.images = images || null
    this.options = {
      imageNameGenerator:
        imageNameGenerator ||
        function (index) {
          return `中国铁塔_${index + 1}.png`
        },
      isSingleImg: isSingleImg || false,
      zipName: `${zipName}.zip` || '中国铁塔.zip',
      watermarkText: watermarkText || '中国铁塔',
      isWatermarkEnabled: isWatermarkEnabled || true
    }
  }

  processImages() {
    console.log('processImages')
    const images = this.images
    const {
      imageNameGenerator,
      isSingleImg,
      zipName,
      watermarkText,
      isWatermarkEnabled
    } = this.options

    return new Promise((resolve, reject) => {
      if (!Array.isArray(images)) {
        reject(new Error('Input must be an array of images.'))
        return
      }

      if (images.length === 0) {
        reject(new Error('The images array is empty.'))
        return
      }

      if (isSingleImg) {
        let imgName = imageNameGenerator(0)
        this.imagesGenerator(
          images[0],
          watermarkText,
          isWatermarkEnabled,
          imgName
        ).then(() => {
          this.downloadPng(imgName)
        })
      } else {
        const promises = images.map((item, index) => {
          return this.imagesGenerator(
            item,
            watermarkText,
            isWatermarkEnabled,
            imageNameGenerator(index)
          )
        })

        Promise.all(promises).then(() => {
          this.downloadZip(zipName)
        })
      }
    })
  }

  imagesGenerator(item, watermarkText, isWatermarkEnabled, imageName) {
    return new Promise((resolve, reject) => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img, 0, 0)

        if (isWatermarkEnabled) {
          const fontSize = 90
          ctx.font = fontSize + 'px PingFang SC, Microsoft YaHei, Arial'
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
          ctx.rotate((-45 * Math.PI) / 180)
          ctx.textAlign = 'center'
          ctx.textBaseline = 'Middle'
          const textWidth = ctx.measureText(watermarkText).width
          for (
            let x = -canvas.width;
            x < canvas.width * 3;
            x += textWidth + 80
          ) {
            for (
              let y = -canvas.height;
              y < canvas.height * 3;
              y += fontSize * 5
            ) {
              ctx.fillText(watermarkText, x, y)
            }
          }
        }

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create Blob.'))
            return
          }
          this.blobToUint8Array(blob)
            .then((uint8Array) => {
              this.zip.file(imageName, uint8Array, { binary: true })
              resolve()
            })
            .catch(reject)
        }, 'image/png')
      }

      img.onerror = (err) => {
        reject(new Error(`Failed to load image: ${item.imgUrl}`))
      }

      img.src = item.imgUrl.replace(
        /https:\/\/video-platform\.obs\.cn-north-4\.myhuaweicloud\.com/g,
        '/presetImgUrl'
      )
      // img.src = item.imgUrl
    })
  }

  blobToUint8Array(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(new Uint8Array(reader.result))
      reader.onerror = reject
      reader.readAsArrayBuffer(blob)
    })
  }

  downloadZip(zipName) {
    console.log('downloadZip')
    this.zip.generateAsync({ type: 'blob' }).then((content) => {
      this.download(zipName, content)
    })
  }

  downloadPng(imageName) {
    this.zip
      .file(imageName)
      .async('blob')
      .then((content) => {
        this.download(imageName, content)
      })
  }

  download(name, content) {
    console.log('download')
    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(content)
    downloadLink.download = name
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(downloadLink.href)
  }
}

export default ImageDownloader
