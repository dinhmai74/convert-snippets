const fs = require('fs')
const { parse } = require('./parse')
const logger = require('./logger')

function generate(input, output) {
  const source = fs.readFileSync(input)

  const isUltisnips = /.snippets$/.test(input)
  if (isUltisnips) {
    const json = ultisnipsToJSON(source)
    fs.writeFileSync(output, json)
  } else {
    const ultisnips = jsonToUltisnips(source)
    fs.writeFileSync(output, ultisnips)
  }
}

function ultisnipsToJSON(ultisnips) {
  const snippets = parse(ultisnips)
  return JSON.stringify(snippets, null, 2)
}

function jsonToUltisnips(json) {
  const snippets = Object.values(JSON.parse(json))
  return snippets.map(toUltisnips).join('\n')
}

function toUltisnips(snippet) {
  const body = Array.isArray(snippet.body)
    ? snippet.body.join('\n\t')
    : snippet.body
  // prettier-ignore
  return `snippet ${formatPrefix(snippet.prefix)}
  ${formatBody(body)}
`
}

/**
 * @param {string} prefix
 */
function formatPrefix(prefixOrPrefixes) {
  let prefix = prefixOrPrefixes

  return prefix.replace('"', '')
}

/**
 * @param {string} body
 */
function formatBody(body) {
  return body.replace(/\\}/g, '}').replace(/\\\$/g, '$').replace(/\\\\/, '\\')
}

module.exports = {
  generate,
  ultisnipsToJSON,
  jsonToUltisnips,
}
