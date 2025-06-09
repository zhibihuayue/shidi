const updateColors = (variables, selector = '', important = true) => {
  const styleSheet = document.getElementById('theme-wiseblue').sheet

  try {
    let found = false
    for (let rule of styleSheet.cssRules) {
      const ruleArr = rule.selectorText.split(' ')
      console.log(ruleArr)
      if (
        (ruleArr.length === 1 && selector === '') ||
        ruleArr.includes(selector)
      ) {
        found = true
        for (let property in variables) {
          if (Object.prototype.hasOwnProperty.call(variables, property)) {
            let value = variables[property]
            let priority = important ? 'important' : ''
            rule.style.setProperty(property, value, priority)
          }
        }
      }
    }
    if (!found && selector) {
      let ruleText = `${selector} { `
      for (let property in variables) {
        let value = variables[property]
        ruleText += `${property}: ${value}${important ? ' !important' : ''}; `
      }
      ruleText += `}`
      styleSheet.insertRule(ruleText, styleSheet.cssRules.length)
    }
  } catch (error) {
    console.error('Error accessing stylesheet:', error)
  }
}

const setup = () => {
  const wiseblueStyle = document.createElement('style')
  const aqamarineStyle = document.createElement('style')
  const terracottaStyle = document.createElement('style')

  wiseblueStyle.id = 'theme-wiseblue'
  aqamarineStyle.id = 'theme-aquamarine'
  terracottaStyle.id = 'theme-terracotta'

  wiseblueStyle.innerHTML = `
    [data-theme='theme-wiseblue'] {}
    [data-theme='theme-wiseblue'] .common-iw-s {}
  `
  document.head.appendChild(aqamarineStyle)
  document.head.appendChild(terracottaStyle)
  document.head.appendChild(wiseblueStyle)
  if (typeof window !== undefined) {
    window.updateColors = updateColors
  }
}

export { setup }
