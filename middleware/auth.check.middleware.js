const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.accessTokenSecret);
    req.userData = decoded;
    next();
  } catch (error) {
    throw new Error('INVALID_ACCESS_TOKEN');
  }
};
