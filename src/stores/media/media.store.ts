import { Context, Effect as E, type Schema } from 'effect'
import type { MediaParsingError } from '../../domain/media/media.errors'
import {
  MediaResponse,
  type UnifiedMediaRequest,
} from '../../domain/media/media.schema'

type UnifiedMediaRequestType = Schema.Schema.Type<typeof UnifiedMediaRequest>

export class MediaStore extends Context.Tag('MediaStore')<
  MediaStore,
  {
    readonly parseMedia: (
      request: UnifiedMediaRequestType,
    ) => E.Effect<Schema.Schema.Type<typeof MediaResponse>, MediaParsingError>
  }
>() {
  static Deepgram = MediaStore.of({
    parseMedia: E.fn('parse-media')(function* (
      request: UnifiedMediaRequestType,
    ) {
      yield* E.annotateCurrentSpan('request', request)
      return MediaResponse.make({
        json: [],
      })
    }),
  })
}
