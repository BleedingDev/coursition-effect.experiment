import { DevTools } from '@effect/experimental'
import * as Otlp from '@effect/opentelemetry/Otlp'
import {
  HttpApiBuilder,
  HttpApiScalar,
  HttpMiddleware,
  HttpServer,
} from '@effect/platform'
import { BunHttpServer, BunRuntime } from '@effect/platform-bun'
import * as FetchHttpClient from '@effect/platform/FetchHttpClient'
import { Effect as E, Layer } from 'effect'
import { api } from './api'
import { envVars } from './config'
import { getJobByIdHandler } from './handlers/jobs/get-job-by-id.handler'
import { getJobResultHandler } from './handlers/jobs/get-job-result.handler'
import { getJobsHandler } from './handlers/jobs/get-jobs.handler'
import { parseMediaHandler } from './handlers/media/parse-media.handler'
import { JobsStore } from './stores/jobs/jobs.store'
import { MediaStore } from './stores/media/media.store'

const mediaGroupImplementation = HttpApiBuilder.group(
  api,
  'media',
  (handlers) =>
    handlers
      .handle('parseMedia', ({ payload }) => parseMediaHandler(payload))
      .handle('getJobs', () => getJobsHandler())
      .handle('getJob', ({ path: { id } }) => getJobByIdHandler(id))
      .handle('getJobResult', ({ path: { id } }) => getJobResultHandler(id)),
)

const ApiImplementation = HttpApiBuilder.api(api).pipe(
  Layer.provide(mediaGroupImplementation),
  Layer.provide(JobsStore.Default),
  Layer.provide(Layer.succeed(MediaStore, MediaStore.Deepgram)),
)

const ServerLayer = E.gen(function* () {
  const port = yield* envVars.PORT

  return Layer.mergeAll(
    DevTools.layer(),
    Otlp.layer({
      baseUrl: 'http://localhost:4318',
      resource: { serviceName: 'coursition-api' },
    }).pipe(Layer.provide(FetchHttpClient.layer)),
    HttpApiScalar.layer(),
    HttpApiBuilder.middlewareCors(),
    BunHttpServer.layer({ port }),
  )
}).pipe(Layer.unwrapEffect)

const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  HttpServer.withLogAddress,
  Layer.provide(ServerLayer),
  Layer.provide(ApiImplementation),
)

BunRuntime.runMain(Layer.launch(HttpLive))
