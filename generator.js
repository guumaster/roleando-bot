const axios = require('axios')
const rpgen = require('@guumaster/rpgen')
const striptags = require('striptags')

const config = require('./config')

const API_URL = 'https://roleando.herokuapp.com'
const MAX_RETRIES = config.maxRetries
const LABELS = config.generatorLabels
const GENERATORS = config.generators
const GENERATORS_IDS = Object.values(config.generators)

const isTwittable = str => str.length <= config.tweetLength

const pick = arr => arr[Math.floor(Math.random() * arr.length)]

const loadGenerator = id => {
  console.log(`Loading generator: ${id}`)

  return axios
    .get(`${API_URL}/api/generators/table/${id}`)
    .then(res => res.data)
    .then(res => {
      const { tpls, tables } = res.data
      const childrenNames = Object.keys(res.children)
      let children = ''
      if (childrenNames.length) {
        children = childrenNames.reduce((str, key) => {
          const data = res.children[key]
          return `${str}\n\n${data.tables}`
        }, '')
      }
      return rpgen.generator.create(`${tpls}\n\n${tables}\n\n${children}`)
    })
}

const generateUntilTwittable = (generator, extra) => {
  let cleanText
  let times = 0

  do {
    times++
    cleanText = generator.generate()
    cleanText = striptags(cleanText, '<strong>', '\n').replace(/\n+/g, '\n').replace(/ +/g, ' ')
    cleanText = striptags(cleanText, [], '')
  } while (!isTwittable(`${cleanText}\n${extra}`) && times < MAX_RETRIES)

  if (times === MAX_RETRIES) {
    throw new Error(`Generator made too long texts after ${MAX_RETRIES} retries`)
  }

  if (times > 1) {
    console.log(`Got one after ${times} times`)
  }

  return cleanText
}

const getLabel = (text) => {
  return Object.keys(LABELS).reduce((label, key) => {
    if (label) return label

    if ( LABELS[key].some(lb => text.toLowerCase().match(lb))) {
      return key
    }
  }, '')
}

const generateRandomText = async () => {
  const id = pick(GENERATORS_IDS)
  const generator = await loadGenerator(id)
  return generateUntilTwittable(generator)
}

const generateByLabel = async (key, extra) => {
  const id = GENERATORS[key]
  if (!key) {
    throw new Error(`Unknown generator ${id}`)
  }
  const generator = await loadGenerator(id)
  return generateUntilTwittable(generator, extra)
}

module.exports = {
  getLabel,
  generateByLabel,
  generateRandomText
}
