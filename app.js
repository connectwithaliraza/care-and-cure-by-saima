// cPanel/LiteSpeed loads this file synchronously through Passenger. Keep this
// module free of top-level await so it can be loaded by lsnode's require().
import { createServer } from 'node:http'
import next from 'next'

const port = Number(process.env.PORT || 3000)
const hostname = process.env.HOST || '0.0.0.0'
const nextApp = next({ dev: false, hostname, port })
const handle = nextApp.getRequestHandler()

nextApp
  .prepare()
  .then(() => {
    createServer((request, response) => handle(request, response)).listen(
      port,
      hostname,
      () => {
        console.log(`Care and Cure is running on http://${hostname}:${port}`)
      },
    )
  })
  .catch((error) => {
    console.error('Unable to start Care and Cure', error)
    process.exitCode = 1
  })
