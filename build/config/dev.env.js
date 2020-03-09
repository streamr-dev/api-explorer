var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SWAGGER_PATH: '"https://cdn.streamr.com/swagger.json"'
})
