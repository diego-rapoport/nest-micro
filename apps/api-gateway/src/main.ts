/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { createProxyMiddleware } from 'http-proxy-middleware'

import { AppModule } from './app/app.module'
import * as localEnv from './environments/environment'
import * as prodEnv from './environments/environment.prod'

function getEnv(): string {
  return process.env.ENV
}

function returnEnvs() {
  const env = getEnv()
  if (env === 'local') return localEnv.environment
  else if (env === 'production') return prodEnv.environment
}

async function bootstrap() {
  const envVars = returnEnvs()
  const app = await NestFactory.create(AppModule)
  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  const USERS_SERVICE_URL = 'http://localhost:3331'
  const TASKS_SERVICE_URL = 'http://localhost:3332'

  app.use(
    '/api/users',
    createProxyMiddleware({
      target: USERS_SERVICE_URL,
      changeOrigin: true,
    })
  )
  app.use(
    '/api/tasks',
    createProxyMiddleware({
      target: TASKS_SERVICE_URL,
      changeOrigin: true,
    })
  )

  const port = envVars['PORT'] || 3333
  await app.listen(port)
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  )
}

bootstrap()
