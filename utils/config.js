const puppeteer = {
  userAgent:
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
  viewport: {
    width: 800,
    height: 1200,
  },
}

const cors = {
  origin: process.env.TWITTER_CRAWLER_SERVER_CORS_ORIGIN,
}


module.exports = { puppeteer, cors }
