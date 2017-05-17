
require('dotenv').config()

const Twit = require('twit')
const TwitterBot = require('node-twitterbot').TwitterBot

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

const Bot = new TwitterBot({
 consumer_key: process.env.BOT_CONSUMER_KEY,
 consumer_secret: process.env.BOT_CONSUMER_SECRET,
 access_token: process.env.BOT_ACCESS_TOKEN,
 access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET
})

const phrases = [ 
`Estamos explorando un asentamiento inundado que se encuentra en un yermo desolado buscando la torre de un mago loco.

Estamos aquí para llevar un villano ante la justicia protegido por hordas de monstruos y una mente criminal.`,

	`Estamos explorando un asentamiento inundado que se encuentra en una isla inexplorada buscando la cámara del ultimo rey enano.

Estamos aquí para encontrar al elegido protegido por cultistas locos y un poderoso hechicero`,

	`Estamos explorando unas ruinas remotas que se encuentra en la jungla tropical buscando la guarida de una bestia legendaria.

Estamos aquí para llevar un villano ante la justicia protegido por cultistas locos y un horror alienígena.`,

	`Estamos explorando un valle perdido que se encuentra en los limites de un gran pantano buscando el escondite de un famoso ladrón.

Estamos aquí para encontrar al elegido protegido por guerreros expertos y un guerrero despótico.`

]

const next = pick(phrases)
console.log('Twetting... ', next)
Bot.tweet(next)

