/**
 * Simple API key auth,
 * usage is optional
 */
const key = (req, res, next) => {
  const header = req.headers['authorization']

  if (!header) {
    res.status(403).send('Forbidden')
  } else {
    let token = header.split(' ')[1]
    let verified = token === process.env.TWITTER_CRAWLER_SERVER_KEY ? true : false
    verified ? next() : res.status(403).send('Forbidden')
  }
}

module.exports = { key }
