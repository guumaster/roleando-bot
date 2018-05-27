const { tweetImage } = require('./twitter')

const sendImageTweet = async () => {
  try {
    tweetImage({
      imgUrl: 'https://roleando-random-image.now.sh/',
      altText: '#StoryCubes',
      status: 'Escribe una historia para esta imagen #StoryCubes #roleando'
    })
    console.log('Done')
  } catch (err) {
    console.error('Ups! something broke', err)
  }
}

sendImageTweet()
