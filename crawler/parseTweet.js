const cheerio = require('cheerio')

/**
 * Parses article html and
 * returns parsed tweet data
 */
function parseTweet(article) {
  let tweet = {}
  const $ = cheerio.load(article)

  $('a').each((i, link) => {
    const href = link.attribs.href
    if (href && href.includes('/status/')) {
      let arr = href.split('/')

      if (arr.length == 4) {
        tweet.handle = arr[arr.length - 3]
        tweet.status_id = arr[arr.length - 1]
      }
    }
  })

  let datetime = $('time').attr('datetime')
  tweet.epoch = Date.parse(datetime)

  let auto = $('div[dir="auto"]').text().trim()
  if (auto && auto.includes('Replying to')) {
    tweet.is_reply = true
  } else {
    tweet.is_reply = false
  }

  let langDiv = $('div[lang]')[0]
  let lanuage = $(langDiv).attr('lang')
  tweet.dispose = lanuage === 'en' ? false : true

  let text = $(langDiv).text().trim()
  let textArray = text.split('\n')
  let trimTextArray = textArray.map((s) => s.trim())
  tweet.body = trimTextArray.join(' ')

  return tweet
}

module.exports = { parseTweet }
