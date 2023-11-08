// config/config.js
'use strict'

const common = require('./common')
const logger = require('./logger')
const server = require('./server')
const images = require('./images')
const jwt = require('./jwt')
const s3 = require('./s3')

module.exports = Object.assign({}, common, logger, server, images, jwt, s3)
