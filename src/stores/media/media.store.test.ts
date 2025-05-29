import { describe, expect, it } from '@effect/vitest'
import { Effect as E } from 'effect'
import { MockConfigLayer } from '../../config.js'
import { MediaStore } from './media.store.js'

describe('MediaStore', () => {
  describe('parseMedia', () => {
    it.effect('should parse media successfully', () =>
      E.gen(function* () {
        const store = yield* MediaStore
        const request = {
          url: 'https://example.com/video.mp4',
          language: 'en',
        }
        const result = yield* store.parseMedia(request)

        expect(result.json).toHaveLength(3)
        expect(result.json[0]?.text).toBe('Hello world')
        expect(result.json[1]?.text).toBe('This is a test')
        expect(result.json[2]?.text).toBe('Subtitle parsing complete')
      }).pipe(
        E.provide(
          MediaStore.makeTestService({
            parseMedia: () =>
              E.succeed({
                json: [
                  { start: 0, end: 5000, text: 'Hello world' },
                  { start: 5000, end: 10000, text: 'This is a test' },
                  {
                    start: 10000,
                    end: 15000,
                    text: 'Subtitle parsing complete',
                  },
                ],
              }),
          }),
        ),
        E.provide(MockConfigLayer),
      ),
    )

    it.effect('should handle file upload request', () =>
      E.gen(function* () {
        const store = yield* MediaStore
        const request = {
          url: 'https://example.com/uploaded-file.mp4',
          language: 'es',
        }
        const result = yield* store.parseMedia(request)

        expect(result.json).toHaveLength(3)
        expect(result.json[0]?.start).toBe(0)
        expect(result.json[0]?.end).toBe(5000)
        expect(result.json[0]?.text).toBe('Hola mundo')
      }).pipe(
        E.provide(
          MediaStore.makeTestService({
            parseMedia: () =>
              E.succeed({
                json: [
                  { start: 0, end: 5000, text: 'Hola mundo' },
                  { start: 5000, end: 10000, text: 'Esta es una prueba' },
                  { start: 10000, end: 15000, text: 'Análisis completo' },
                ],
              }),
          }),
        ),
        E.provide(MockConfigLayer),
      ),
    )
  })
})
