const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SITE_URL: '"http://timezonedev.com/"',
  API_URL: '"https://api.clockin.space/"'
})
