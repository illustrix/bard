import Koa from 'koa'
import config from './config'
import { larkEventHandler } from './event'
import { logger } from './logger'

const app = new Koa()

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const time = Date.now() - start

  logger.info('processed', {
    type: 'req',
    method: ctx.method,
    path: ctx.URL.pathname,
    url: ctx.URL.toString(),
    status: ctx.status,
    size: ctx.length,
    time,
  })
})
app.use(larkEventHandler)

app.listen(config.port, () => {
  console.log('server is listening on port', config.port)
})
