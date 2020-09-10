var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SWAGGER_PATH: '"https://gitcdn.xyz/cdn/streamr-dev/engine-and-editor/5e4d5dc22c5ca60ec11bc6fc034e0d2cd72e451d/docs/swagger.json"'
})
