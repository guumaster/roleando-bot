const Twitter = require('twit')
const axios = require('axios')

const config = require('./config')

const T = new Twitter(config.twitter)

const tweet = ({ status, inReplyTo, dryRun }) => new Promise((resolve, reject) => {
  if (dryRun) {
    console.log(`This would tweet: \n\t${status}`)
    return
  }

  console.log('Tweeting...')
  T.post('statuses/update', { status, in_reply_to_status_id: inReplyTo }, (err, data) => {
    if (err) {
      console.error('Error twitting:', err)
      return reject(err)
    }

    console.log(`Published tweet ${data.id_str}. done!`)
    console.log(data.text)
    return resolve()
  })
})

const replyToTweet = ({ originalTweet, reply, dryRun }) => {
  console.log(`Replying to ${originalTweet.id_str}`)
  return tweet({
    status: `@${originalTweet.user.screen_name}\n${reply}`,
    inReplyTo: originalTweet.id_str,
    dryRun
  })
}

const tweetImage = ({ imgUrl, altText, status, inReplyTo }) => new Promise(async (resolve, reject) => {
  const img = await getBase64Image(imgUrl)

  T.post('media/upload', { media_data: img }, (err, data, response) => {
    if (err) {
      return reject(err)
    }

    const meta_params = {
      media_id: data.media_id_string,
      alt_text: { text: altText }
    }

    T.post('media/metadata/create', meta_params, (err, data, response) => {
      if (err) {
        return reject(err)
      }

      T.post('statuses/update', {
        status,
        in_reply_to_status_id: inReplyTo,
        media_ids: [meta_params.media_id]
      }, (err, data, response) => {
        if (err) {
          return reject(err)
        }

        console.log('Tweeted', data)

        return resolve(data)
      })
    })
  })
})

const deleteTweet = (id) => new Promise((resolve, reject) => {

  T.post('statuses/destroy/:id', { id }, (err, data, response) => {
    if (err) {
      return reject(err)
    }

    return resolve(data)
  })
})

const isReplyRequest = (tweet) => {
  return tweet.user.screen_name !== config.botScreenName
    && (tweet.in_reply_to_screen_name === config.botScreenName
      || tweet.text.match(`@${config.botScreenName}`))
}

const isStoryCubesRequest = tweet => {
  return !tweet.in_reply_to_status_id && tweet.entities.hashtags.map(x => x.text.toLowerCase()).includes('storycubes')
}

const getBase64Image = async (url) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' })
  return Buffer.from(response.data, 'binary').toString('base64')
}

const startReplier = fns => {
  const stream = T.stream('user')

  if (!Array.isArray(fns)) {
    fns = [fns]
  }

  console.log('Listening to tweet events')

  stream.on('tweet', (tweet) => {
    fns.map(fn => fn(tweet))
  })
}

module.exports = {
  tweet,
  tweetImage,
  deleteTweet,
  isReplyRequest,
  isStoryCubesRequest,
  replyToTweet,
  startReplier
}
