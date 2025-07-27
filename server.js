import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

console.time('🔧 Server startup')

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true)
      handle(req, res, parsedUrl)
    }).listen(port, () => {
      console.timeEnd('🔧 Server startup')
      console.log(`✅ Server listening at http://localhost:${port} as ${dev ? 'development' : 'production'}`)
      console.log('Starting server...')
      console.log('NODE_ENV:', process.env.NODE_ENV)
      console.log('DATABASE_URL:', process.env.DATABASE_URL)
    })
  })
  .catch((err) => {
    console.error('❌ Failed to start server', err)
    process.exit(1)
  })
