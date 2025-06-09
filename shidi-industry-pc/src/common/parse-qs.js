function parseQueryString(queryString) {
  const params = {};

  // 如果查询字符串为空或者为 undefined，则直接返回空对象
  if (!queryString) {
    return params;
  }

  // 去掉开头的问号
  queryString = queryString.startsWith('?') ? queryString.substring(1) : queryString;

  // 使用 URLSearchParams 解析查询字符串
  const urlParams = new URLSearchParams(queryString);
  
  // 遍历所有参数
  for (const [key, value] of urlParams) {
    const decodedKey = decodeURIComponent(key);
    const decodedValue = decodeURIComponent(value);

    // 如果该参数已经存在，则转换为数组
    if (params[decodedKey]) {
      if (!Array.isArray(params[decodedKey])) {
        params[decodedKey] = [params[decodedKey]];
      }
      params[decodedKey].push(decodedValue);
    } else {
      params[decodedKey] = decodedValue;
    }
  }

  return params;
}

export { parseQueryString };
