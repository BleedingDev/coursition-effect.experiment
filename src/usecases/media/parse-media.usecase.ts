import { Effect as E, type Schema } from 'effect'
import type { UnifiedMediaRequest } from '../../domain/media/media.schema.js'
import { MediaStore } from '../../stores/media/media.store.js'

type UnifiedMediaRequestType = Schema.Schema.Type<typeof UnifiedMediaRequest>

export const parseMediaUsecase = (request: UnifiedMediaRequestType) =>
  E.gen(function* () {
    const mediaStore = yield* MediaStore
    const result = yield* mediaStore.parseMedia(request)
    return result
  }).pipe(
    E.tapError(E.logError),
    E.orDie, // Die on any unexpected errors
    E.withSpan('parseMediaUsecase', {
      attributes: {
        language: request.language,
        source: 'url' in request ? 'url' : 'file',
      },
    }),
  )
