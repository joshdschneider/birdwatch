const express = require('express')
const router = express.Router()
const { crawlTimeline } = require('../crawler/crawlTimeline')

/**
 * Crawls timeline & returns tweets,
 * summary, and errors
 */
router.post('/crawl', async (req, res) => {
  try {
    const keywords = req.body.keywords
    const from = req.body.from
    const crawl = await crawlTimeline(keywords, from)

    if (crawl.errors.length) {
      res.status(500).send(crawl)
    } else {
      res.status(200).send(crawl)
    }
  } catch (e) {
    console.error(e)
  }
})

module.exports = router
