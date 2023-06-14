import os from 'os'
import { createLogger, format } from 'winston'
import ConsoleTransport from 'winston-humanize-console-transport'
import config from './config'
const { combine, timestamp } = format

export const logger = createLogger({
  format: combine(timestamp()),
  defaultMeta: { pid: process.pid, host: os.hostname() },
  transports: [new ConsoleTransport()],
  level: config.logLevel,
})
