const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const notesRouter = require('./controllers/notes')
const peopleRouter = require('./controllers/people')

const app = express()
logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB', error.message)
  })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

// Make router change according to HTML head title
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const util = require('util')
let htmlStr = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf-8', function(err, data) {
  if (err){
    logger.error(err)
    process.exit(1)
  }
  return util.format(data,'test')
})
const $ = cheerio.load(htmlStr)
const headTags = []
$('head > *').each((_, elm) => {
  headTags.push({ name: elm.name, attribs: elm.attribs, text: $(elm).text() })
})

if (headTags[3].text.toString() === 'Notes') app.use('/api/notes', notesRouter)
if (headTags[3].text.toString() === 'Phonebook') app.use('/api/people', peopleRouter)
logger.info('using', headTags[3].text.toString(), 'routes')

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
