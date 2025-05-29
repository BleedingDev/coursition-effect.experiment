import { Effect as E } from 'effect'
import type { Schema } from 'effect'
import { MediaEmpty } from '../../domain/media/media.errors.js'
import type { UnifiedMediaRequest } from '../../domain/media/media.schema.js'
import { parseMediaUsecase } from '../../usecases/media/parse-media.usecase.js'

type UnifiedMediaRequestType = Schema.Schema.Type<typeof UnifiedMediaRequest>

export const parseMediaHandler = (request: UnifiedMediaRequestType) =>
  E.gen(function* () {
    const result = yield* parseMediaUsecase(request)
    return result
  }).pipe(
    E.catchTags({
      // Map internal errors to API errors
      MediaParsingError: () => new MediaEmpty(),
    }),
    E.tapError(E.logError),
    E.withSpan('parseMediaHandler', {
      attributes: {
        language: request.language,
        source: 'url' in request ? 'url' : 'file',
      },
    }),
  )
