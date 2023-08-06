const colors = require('colors')

const init_route = (req, res, next) => {
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(`[endpoint working] inside: ${url}`.cyan)
    next()
}

module.exports = init_route