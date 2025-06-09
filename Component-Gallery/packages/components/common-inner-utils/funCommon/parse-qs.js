function parseQueryString(queryString) {
  const params = {}
  if (queryString) {
    // 去掉开头的问号
    queryString = queryString.substring(1)
    const pairs = queryString.split('&')
    for (const pair of pairs) {
      const [key, value] = pair.split('=')
      const decodedKey = decodeURIComponent(key)
      const decodedValue = decodeURIComponent(value)
      // 如果该参数已经存在，则转换为数组
      if (params[decodedKey]) {
        if (!Array.isArray(params[decodedKey])) {
          params[decodedKey] = [params[decodedKey]]
        }
        params[decodedKey].push(decodedValue)
      } else {
        params[decodedKey] = decodedValue
      }
    }
  }
  return params
}

export { parseQueryString }
