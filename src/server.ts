import {DevTools} from '@effect/experimental'
import * as Otlp from '@effect/opentelemetry/Otlp'
import {HttpApiBuilder, HttpApiScalar, HttpMiddleware, HttpServer,} from '@effect/platform'
import {BunHttpServer, BunRuntime} from '@effect/platform-bun'
import * as FetchHttpClient from '@effect/platform/FetchHttpClient'
import {Effect as E, Layer} from 'effect'
import {api} from './api'
import {envVars} from './config'
import {getJobByIdHandler} from './handlers/jobs/get-job-by-id.handler'
import {getJobResultHandler} from './handlers/jobs/get-job-result.handler'
import {getJobsHandler} from './handlers/jobs/get-jobs.handler'
import {parseMediaHandler} from './handlers/media/parse-media.handler'
import {JobsStore} from './stores/jobs/jobs.store'
import {MediaStore} from './stores/media/media.store'
import {WorkflowStore} from "./stores/workflow/workflowStore.ts";
import {greeterWorkflow, processVideoHandler} from "./handlers/workflow/video-processing.ts";
import * as restate from "@restatedev/restate-sdk";

const mediaGroupImplementation = HttpApiBuilder.group(
  api,
  'media',
  (handlers) =>
    handlers
      .handle('parseMedia', ({ payload }) => parseMediaHandler(payload))
      .handle('processVideo', (request) => processVideoHandler(request))
      .handle('getJobs', () => getJobsHandler())
      .handle('getJob', ({ path: { id } }) => getJobByIdHandler(id))
      .handle('getJobResult', ({ path: { id } }) => getJobResultHandler(id)),
)

// Bind and start the server
restate
  .endpoint()
  .bind(greeterWorkflow)
  .listen(9080)

const ApiImplementation = HttpApiBuilder.api(api).pipe(
  Layer.provide(mediaGroupImplementation),
  Layer.provide(JobsStore.Default),
  Layer.provide(Layer.succeed(MediaStore, MediaStore.Deepgram)),
  Layer.provide(Layer.succeed(WorkflowStore, WorkflowStore.RestateStore)),
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
