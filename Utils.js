import stopwords from './stopwords'

function isEmail(input) {
  const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i
  return expression.test(String(input).toLowerCase())
}

function isStrength(input) {
  const expression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#!%+-/?|_])[0-9a-zA-Z$*&@#!%+-/?|_]{8,}$/
  return expression.test(input)
}

function isEmpty(input) {
  return input.length === 0
}

function isEqual(input1, input2) {
  return input1 === input2
}

function toCamelCase(string) {
  const words = string.split(' ')
  const lWords = words.map((word) => word.toLowerCase())

  const formatedTitle = lWords
    .map((word) => {
      return stopwords.includes(word)
        ? word
        : word && word[0].toUpperCase() + word.substring(1)
    })
    .join(' ')

  return formatedTitle.charAt(0).toUpperCase() + formatedTitle.slice(1)
}

function formatAbntText(abnt) {
  const text = abnt.match(/<strong[^>]*>([^<]+)<\/strong>/)[1]
  const textFormated = `<strong>${toCamelCase(text)}</strong>`
  return abnt.replace(
    /<strong[^>]*>([^<]+)<\/strong>/,
    `<strong>${textFormated}</strong>`
  )
}

function stripHtml(html) {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

function getDeviceType() {
  const ua = navigator.userAgent

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet'
  }

  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return 'mobile'
  }
  return 'desktop'
}

function returnSizeByDeviceType() {
  const typesDevice = {
    desktop: 'large',
    tablet: 'medium',
    mobile: 'small'
  }

  return typesDevice[getDeviceType()]
}

async function getUserIp() {
  return fetch('https://api.ipify.org/?format=json')
    .then((res) => res.json())
    .then((data) => data.ip)
}

const parseJwt = (token) => {
  if (!token) {
    return {}
  }

  const base64Url = token.split('.')[1]

  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`
      })
      .join('')
  )

  return JSON.parse(jsonPayload)
}

function cnpjMask(value) {
  return value
    .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
    .replace(/(\d{2})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 2 e o segundo de 3, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1') // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
}

function isInvalidCnpjNumber(value) {
  const cnpjMaxCharacters = 18
  return value.length > 0 && value.length < cnpjMaxCharacters
}

function openInANewTab(url) {
  window.open(url, '_blank', 'noopener noreferrer')
}

export {
  isEmail,
  isStrength,
  isEmpty,
  isEqual,
  toCamelCase,
  formatAbntText,
  stripHtml,
  getDeviceType,
  returnSizeByDeviceType,
  getUserIp,
  parseJwt,
  cnpjMask,
  isInvalidCnpjNumber,
  openInANewTab
}
