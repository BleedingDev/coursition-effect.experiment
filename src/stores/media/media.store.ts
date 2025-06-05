import { Effect as E, Layer, type Schema } from 'effect'
import { envVars } from '../../config'
import { MediaParsingError } from '../../domain/media/media.errors'
import {
  MediaResponse,
  type UnifiedMediaRequest,
} from '../../domain/media/media.schema'

type UnifiedMediaRequestType = Schema.Schema.Type<typeof UnifiedMediaRequest>

export class MediaStore extends E.Service<MediaStore>()('MediaStore', {
  effect: E.gen(function* () {
    const parsingEngineUrl = yield* envVars.PARSING_ENGINE_URL

    return {
      parseMedia: (request: UnifiedMediaRequestType) =>
        E.gen(function* () {
          try {
            // Mock parsing logic - replace with actual implementation
            yield* E.sleep('100 millis') // Simulate processing time - Commented out for testing

            return MediaResponse.make({
              json: [
                { start: 0, end: 5000, text: 'Hello world' },
                { start: 5000, end: 10000, text: 'This is a test' },
                {
                  start: 10000,
                  end: 15000,
                  text: 'Subtitle parsing complete',
                },
              ],
            })
          } catch (error) {
            return yield* new MediaParsingError({
              source: 'url' in request ? request.url : 'file',
              error,
            })
          }
        }).pipe(
          E.withSpan('MediaStore.parseMedia', {
            attributes: {
              parsingEngineUrl,
              language: request.language,
            },
          }),
        ),
    }
  }),
}) {
  static makeTestService = (
    mockImplementation: Partial<Omit<MediaStore, '_tag'>>,
  ) =>
    Layer.succeed(MediaStore, {
      _tag: 'MediaStore',
      parseMedia: () => E.die('Not implemented' as const),
      ...mockImplementation,
    })
}
