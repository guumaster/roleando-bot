require('dotenv').config()

const axios = require('axios')
const rpgen = require('@guumaster/rpgen')
const striptags = require('striptags')
const Twitter = require('twit')

const API_URL = 'https://roleando.herokuapp.com'

const TWITTER_GENERATORS = [
  'BytfSUVS', // Profecias
  'Hy_JYs8yZ', // Graffitis
  'SJfca2q4', // Dungeons
  'ryhpUxVH', // Presagios
  'rJZnFG74', // Destinos misticos
  'Hk8Z2R9S', // Simbolos extraños
  'rkdh21CR' // Garitos
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

const twitRandomText = generator => {
  const text = generator.generate()
  const cleanText = striptags(text, [], '\n')
    .replace(/\n+/g, '\n')
    .replace(/ +/g, ' ')

  if (!isTwittable(cleanText)) {
    console.log('Text generated too long:', cleanText)
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
      return
    }

    console.log(`Published tweet ${data.id_str}. done!`, data.text)
  })
}

Promise.resolve(pick(TWITTER_GENERATORS))
  .then(loadGenerator)
  .then(twitRandomText)
  .catch(console.error)
