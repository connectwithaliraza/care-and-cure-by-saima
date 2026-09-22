// LiteSpeed's lsnode loader starts app.js with CommonJS require().
const path = require('node:path')

process.env.HOSTNAME = process.env.HOST || '0.0.0.0'
process.env.PAYLOAD_MEDIA_DIR ||= path.join(__dirname, 'media')

require('./.next/standalone/server.js')
