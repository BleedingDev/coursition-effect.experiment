import { describe, expect, it } from '@effect/vitest'
import { Effect as E } from 'effect'
import { MockConfigLayer } from '../../config.js'
import { MediaStore } from '../../stores/media/media.store.js'
import { parseMediaUsecase } from './parse-media.usecase.js'

describe('parseMediaUsecase', () => {
  it.effect('should parse media from URL', () =>
    E.gen(function* () {
      const request = {
        url: 'https://example.com/video.mp4',
        language: 'en',
      }
      const result = yield* parseMediaUsecase(request)

      expect(result.json).toHaveLength(3)
      expect(result.json[0]?.text).toBe('Hello world')
      expect(result.json[1]?.start).toBe(5000)
      expect(result.json[2]?.end).toBe(15000)
    }).pipe(E.provide(MediaStore.Default), E.provide(MockConfigLayer)),
  )

  it.effect('should work with custom test service', () =>
    E.gen(function* () {
      const request = {
        url: 'https://example.com/test.mp4',
        language: 'es',
      }
      const result = yield* parseMediaUsecase(request)

      expect(result.json).toHaveLength(1)
      expect(result.json[0]?.text).toBe('Hola mundo')
    }).pipe(
      E.provide(
        MediaStore.makeTestService({
          parseMedia: () =>
            E.succeed({
              json: [{ start: 0, end: 3000, text: 'Hola mundo' }],
            }),
        }),
      ),
      E.provide(MockConfigLayer),
    ),
  )
})
