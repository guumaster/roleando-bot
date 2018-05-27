const { startReplier, isReplyRequest, replyToTweet, tweetImage, isStoryCubesRequest } = require('./twitter')
const { getLabel, generateByLabel } = require('./generator')

const dryRun = process.env.DRY_RUN

const replyToRequests = async (tweet) => {

  console.log('Tweet received', tweet.text)

  if (!isReplyRequest(tweet)) {
    return
  }

  const label = getLabel(tweet.text)

  if (!label) {
    console.log(`Unknown label on tweet: \n ${tweet.text}`)
    return
  }

  console.log(`Tweeting about ${label}`)

  const reply = await generateByLabel(label, `@${tweet.user.screen_name}`)

  replyToTweet({ originalTweet: tweet, reply, dryRun })
  console.log('Done')
}

const replyWithStoryCubes = async (tweet) => {

  if (!isStoryCubesRequest(tweet)) {
    return
  }

  tweetImage({
    imgUrl: 'https://roleando-random-image.now.sh/',
    altText: '#StoryCubes',
    status: `@${tweet.user.screen_name}\nEscribe una historia para esta imagen #StoryCubes #roleando`,
    inReplyTo: tweet.id_str
  })
  console.log('Done')
}

startReplier([
  replyToRequests,
  replyWithStoryCubes
])

