import os from 'node:os'
import process from 'node:process'
import compression from 'compression'
import express from 'express'
import morgan from 'morgan'
import { createRequestHandler } from '@remix-run/express'

import * as build from '../build/index'

const createApp = (
  build,
  mode = 'production',
  publicPath = '/build/',
  assetsBuildDirectory = 'public/build/',
) => {
  let app = express()

  app.disable('x-powered-by')

  app.use(compression())

  app.use(
    publicPath,
    express.static(assetsBuildDirectory, { immutable: true, maxAge: '1y' }),
  )

  app.use(express.static('public', { maxAge: '1h' }))

  app.use(morgan('tiny'))
  app.all('*', createRequestHandler({ build, mode }))

  return app
}

let port = process.env.PORT ? Number(process.env.PORT) : 3000
if (Number.isNaN(port)) port = 3000

let onListen = () => {
  let address =
    process.env.HOST ||
    Object.values(os.networkInterfaces())
      .flat()
      .find((ip) => String(ip?.family).includes('4') && !ip?.internal)?.address

  if (!address) {
    console.log(`Remix App Server started at http://localhost:${port}`)
  } else {
    console.log(
      `Remix App Server started at http://localhost:${port} (http://${address}:${port})`,
    )
  }
}

const app = createApp(
  build,
  process.env.NODE_ENV,
  build.publicPath,
  build.assetsBuildDirectory,
)
const server = process.env.HOST
  ? app.listen(port, process.env.HOST, onListen)
  : app.listen(port, onListen)

;['SIGTERM', 'SIGINT'].forEach((signal) => {
  process.once(signal, () => server?.close(console.error))
})
