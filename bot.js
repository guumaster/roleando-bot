const { tweet } = require('./twitter')
const { generateRandomText } = require('./generator')

const dryRun = process.env.DRY_RUN

const sendTweet = async () => {
  try {
    const status = await generateRandomText()
    tweet({ status, dryRun })
    console.log('Done')
  } catch (err) {
    console.error('Ups! something broke', err)
  }
}

sendTweet()
