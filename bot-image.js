require('dotenv').config()

const axios = require('axios')
const rpgen = require('@guumaster/rpgen')
const striptags = require('striptags')
const Twitter = require('twit')

const T = new Twitter({
  consumer_key: process.env.BOT_CONSUMER_KEY,
  consumer_secret: process.env.BOT_CONSUMER_SECRET,
  access_token: process.env.BOT_ACCESS_TOKEN,
  access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET
})


const getBase64Image = async (url) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' })
  return Buffer.from(response.data, 'binary').toString('base64')
}

const tweetImage = img => {
  T.post('media/upload', { media_data: img }, function (err, data, response) {
    var mediaIdStr = data.media_id_string
    var altText = "Caption this story"
    var meta_params = {
	    media_id: mediaIdStr, alt_text: { text: altText } 
    }
  
    T.post('media/metadata/create', meta_params, function (err, data, response) {
      if (!err) {
        var params = { status: 'Escribe una historia con estas pistas #storycubes #rol', media_ids: [mediaIdStr] }
  
        T.post('statuses/update', params, function (err, data, response) {
          console.log(data)
        })
      }
    })
  })
}

main = async () => {
  const img =  await getBase64Image('https://roleando-random-image.now.sh/')
  tweetImage(img)
}

main()

