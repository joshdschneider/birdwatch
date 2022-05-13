## Birdwatch

Little project that crawls twitter. Call the `/crawl` API endpoint to fetch the latest tweets related to certain keywords. Built using Puppeteer's headless Chrome browser (great for fetching SPAs, DOM manipulation, user agent spoofing, etc).


Params:
- Array of keywords
- From timestamp (unix time)

Returns:
- Array of tweets
- Performance summary
- Errors
