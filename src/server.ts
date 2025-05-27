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
import { Effect, Layer } from 'effect'
import { api } from './api'

const mediaGroupMock = HttpApiBuilder.group(api, 'media', (handlers) =>
  handlers
    .handle('parseMedia', () =>
      Effect.succeed({
        json: [],
      }),
    )
    .handle('getJobs', () =>
      Effect.succeed({
        jobs: [],
      }),
    )
    .handle('getJob', ({ path: { id } }) =>
      Effect.succeed({
        id,
        name: 'job',
        status: 'in-progress',
      }),
    )
    .handle('getJobResult', ({ path: { id } }) =>
      Effect.succeed({
        id,
        result: 'result',
      }),
    ),
)

const MyApiMock = HttpApiBuilder.api(api).pipe(Layer.provide(mediaGroupMock))

const Observability = Otlp.layer({
  baseUrl: 'http://localhost:4318',
  resource: { serviceName: 'parse-engine' },
}).pipe(Layer.provide(FetchHttpClient.layer))

const ServerLayer = Layer.mergeAll(
  DevTools.layer(),
  Observability,
  HttpApiScalar.layer(),
  HttpApiBuilder.middlewareCors(),
  BunHttpServer.layer({ port: 3001 }),
)

const HttpMock = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  HttpServer.withLogAddress,
  Layer.provide(ServerLayer),
  Layer.provide(MyApiMock),
)

BunRuntime.runMain(Layer.launch(HttpMock))
