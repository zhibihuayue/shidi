export default function (target) {
  for (let i = 1, j = arguments.length; i < j; i++) {
    let source = arguments[i] || {}
    for (let prop in source) {
      // eslint-disable-next-line no-prototype-builtins
      if (source.hasOwnProperty(prop)) {
        let value = source[prop]
        // prettier-ignore
        if (value !== undefined) { // NOSONAR
          target[prop] = value
        }
      }
    }
  }

  return target
}
