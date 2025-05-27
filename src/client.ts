import { FetchHttpClient, HttpApiClient } from '@effect/platform'
import { Effect } from 'effect'
import { api } from './api'

export const apiClient = Effect.gen(function* () {
  const client = yield* HttpApiClient.make(api, {
    baseUrl: 'http://localhost:3001',
  })

  return client
}).pipe(Effect.provide(FetchHttpClient.layer))
