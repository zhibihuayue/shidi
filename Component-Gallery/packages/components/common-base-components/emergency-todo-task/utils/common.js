export const generateFileParams = (list) => {
  // Define the extensions for images
  const img = '.png、.jpg、.jpeg'
  // Define the extension for videos
  const video = '.mp4'
  // Define the extensions for files
  const file = '.txt、.doc、.docx、.pdf、.ppt、.pptx'

  // Initialize arrays to hold image, video, and file URLs
  const imgUrlList = []
  const videoUrlList = []
  const fileUrlList = []

  // Iterate through the list to categorize items based on their file suffix
  list.forEach((item) => {
    // Check if the item's file suffix is an image extension
    if (img.includes(item.fileSuffix.toLowerCase())) {
      imgUrlList.push(item)
    }
    // Check if the item's file suffix is a video extension
    if (video.includes(item.fileSuffix.toLowerCase())) {
      videoUrlList.push(item)
    }
    // Check if the item's file suffix is a file extension
    if (file.includes(item.fileSuffix.toLowerCase())) {
      fileUrlList.push(item)
    }
  })

  // Return the categorized lists
  return {
    imgUrlList,
    videoUrlList,
    fileUrlList
  }
}

export const generateFileList = ({ imgUrlList, videoUrlList, fileUrlList }) => {
  // Initialize an empty array to hold the final result
  const result = []

  // Check if imgUrlList is defined and has items
  if (imgUrlList && imgUrlList.length) {
    // Iterate through each item in imgUrlList
    imgUrlList.forEach((item) => {
      // Add each item to the result array with its originUrl as fileUrl
      result.push({ ...item, fileUrl: item.originUrl })
    })
  }
  // Check if videoUrlList is defined and has items
  if (videoUrlList && videoUrlList.length) {
    // Iterate through each item in videoUrlList
    videoUrlList.forEach((item) => {
      // Add each item to the result array with its originUrl as fileUrl
      result.push({ ...item, fileUrl: item.originUrl })
    })
  }
  // Check if fileUrlList is defined and has items
  if (fileUrlList && fileUrlList.length) {
    // Iterate through each item in fileUrlList
    fileUrlList.forEach((item) => {
      // Add each item to the result array with its originUrl as fileUrl
      result.push({ ...item, fileUrl: item.originUrl })
    })
  }

  // Return the final result array
  return result
}

const generateFileItem = (item) => {
  return {
    fileName: item.fileName + '.' + item.fileSuffix,
    fileSuffix: '.' + item.fileSuffix,
    fileUrl: item.originUrl,
    fileId: item.originUrl,
    uuid: item.originUrl
  }
}
