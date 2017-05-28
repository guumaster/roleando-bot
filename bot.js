require('dotenv').config()

const axios = require('axios')
const rpgen = require('@guumaster/rpgen')
const striptags = require('striptags')
const Twitter = require('twit')

const MAX_RETRIES = 100

const API_URL = 'https://roleando.herokuapp.com'

const TWITTER_GENERATORS = [
  'BytfSUVS',  // Profecias
  'Hy_JYs8yZ', // Graffitis
  'SJfca2q4',  // Dungeons
  'ryhpUxVH',  // Presagios
  'rJZnFG74',  // Destinos misticos
  'Hk8Z2R9S',  // Simbolos extraños
  'rkdh21CR',  // Garitos
  'ryCnVMOb-', // Tramas cortas
  'r1wBUHu-Z'  // Secretos locales
]

const pick = arr => arr[Math.floor(Math.random() * arr.length)]

const isTwittable = str => str.length <= 140

const loadGenerator = id => {
  console.log(`Loading generator: ${id}`)

  return axios
    .get(`${API_URL}/api/generators/table/${id}`)
    .then(res => res.data)
    .then(res => {
      const {tpls, tables} = res.data
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

const generateUntilTwittable = generator => {
  let cleanText
  let times = 1

  do {

    times++
    cleanText = striptags(generator.generate(), [], '\n').replace(/\n+/g, '\n').replace(/ +/g, ' ')

  } while (!isTwittable(cleanText) && times < MAX_RETRIES)

  if (times === MAX_RETRIES) {
    throw new Error(`Generator made too long texts after ${MAX_RETRIES} retries`)
  }

  if (times > 1) {
    console.log(`Got one after ${times} times`)
  }

  return cleanText
}

const twitRandomText = cleanText => new Promise((resolve, reject) => {

  if (process.env.DRY_RUN) {
    console.log(`This would tweet: \n\t${cleanText}`)
    return
  }

  const T = new Twitter({
    consumer_key: process.env.BOT_CONSUMER_KEY,
    consumer_secret: process.env.BOT_CONSUMER_SECRET,
    access_token: process.env.BOT_ACCESS_TOKEN,
    access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET
  })

  console.log('Tweeting...')
  T.post('statuses/update', {status: cleanText}, (err, data) => {
    if (err) {
      console.error('Error twitting:', err)
      return reject(err)
    }

    console.log(`Published tweet ${data.id_str}. done!`, data.text)
    return resolve()
  })
})

Promise.resolve(pick(TWITTER_GENERATORS))
  .then(loadGenerator)
  .then(generateUntilTwittable)
  .then(twitRandomText)
  .catch(console.error)
