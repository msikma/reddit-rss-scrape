/**
 * reddit-rss-scrape - Reddit RSS Scraper <https://github.com/msikma/reddit-rss-scrape>
 * Copyright © 2018, Michiel Sikma
 */

import cheerio from 'cheerio'
import rssParser from 'parse-rss'

// Returns the URL of a sub's RSS feed.
const urlSubRSS = sub => `https://www.reddit.com/r/${sub}/.rss`

const findTopics = async (sub, id) => {
  const items = await rssParse(urlSubRSS(sub))
  if (items.length === 0) return []

  // Copy 'guid' to 'id' for caching, and add a non-HTML description limited to 350 characters.
  return items.map(entry => ({ ...entry, id: entry.guid, descriptionText: removeHTML(entry.description, 350) }))
}

/**
 * Strip HTML from a Reddit RSS description.
 */
const removeHTML = (str, limit=350) => {
  const $ = cheerio.load(str)
  const text = $('.md').text().trim()
  if (limit && text.length > limit) {
    return `${text.slice(0, limit)} [...]`
  }
  return text
}

/**
 * Returns a promise which, upon resolution, contains the contents of the RSS found at the given URL.
 */
const rssParse = (url) => new Promise((resolve, reject) => {
  rssParser(url, (err, rss) => {
    if (err) return reject(err, rss)
    if (rss) return resolve(rss)
  })
})

export default findTopics