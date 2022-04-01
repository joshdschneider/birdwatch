const config = require('../utils/config')
const puppeteer = require('puppeteer')
const { parseTweet } = require('./parseTweet')

/**
 * Crawls twitter, returns
 * tweets, crawl summary, and errors
 */
const crawlTimeline = async (keywords, from) => {
  let t0 = Date.now()
  let target = from
  let errors = {
    limit: 2,
    messages: [],
  }

  for (i = 0; i < errors.limit; i++) {
    try {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      const query = formatQuery(keywords)

      await page.setViewport(config.puppeteer.viewport)
      await page.setUserAgent(config.puppeteer.userAgent)
      await page.goto(`https://twitter.com/search?q=${query}&f=live`)
      await page.waitForSelector('section')
      await page.waitForTimeout(500)

      let scrollCount = 0
      let maxScrolls = 30
      let tweetsArray = []

      while (scrollCount < maxScrolls) {
        let div = await page.$$eval('article', (a) => a.map((a) => a.innerHTML))
        let parsedTweets = div.map((a) => parseTweet(a))
        parsedTweets
          .filter((t) => !t.dispose)
          .map((t) => {
            let tweet = {
              status_id: t.status_id,
              epoch: t.epoch,
              handle: t.handle,
              body: t.body,
              is_reply: t.is_reply,
            }

            tweetsArray.push(tweet)
          })

        if (!target) {
          if (tweetsArray.length >= 25) break
        } else {
          let over = tweetsArray.filter((t) => t.epoch <= target)
          if (over.length) break
        }

        await page.evaluate(scrollToBottom)
        await page.waitForTimeout(1000)
        scrollCount++

        if (scrollCount === maxScrolls - 1) {
          throw new Error('Crawl stuck in loop.')
        }
      }

      await browser.close()

      const tweetSet = new Set(tweetsArray)
      const tweets = [...tweetSet]
      const epochs = []
      tweets.map((t) => epochs.push(t.epoch))
      const tweet_count = tweets.length
      const high_epoch = Math.max(...epochs)
      const low_epoch = Math.min(...epochs)
      const tweets_per_minute = calculateTPM(
        high_epoch,
        low_epoch,
        tweet_count
      )

      const summary = {
        status: 1,
        tweet_count,
        scroll_count: scrollCount,
        tweets_per_minute,
        execution_time: (Date.now() - t0) / 1000,
      }

      return {
        tweets,
        summary,
        errors: [],
      }
    } catch (e) {
      console.error(e)
      errors.messages.push(e.message)

      if (i < errors.limit - 1) {
        target = 0
        console.log('Retrying crawl...')
      }
    }
  }

  const errSet = new Set(errors.messages.flat())
  const err = [...errSet]

  return {
    tweets: [],
    summary: { status: 0 },
    errors: err,
  }
}

/**
 * Returns formatted
 * url query string;
 */
function formatQuery(keywords) {
  q = keywords.map((k) => k + '%20OR%20').join('')
  return `(${q.slice(0, -8)})`
}

/**
 * Executes browser function
 * that scrolls to bottom of page;
 */
function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight)
}

/**
 * Calculates the tweets per minute
 * for the given keywords
 */
async function calculateTPM(high, low, total) {
  let tpm = (60 / ((high - low) / 1000)) * total
  return Math.round(tpm)
}

module.exports = { crawlTimeline }
