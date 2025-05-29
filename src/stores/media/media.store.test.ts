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
      }).pipe(E.provide(MediaStore.Default), E.provide(MockConfigLayer)),
    )

    it.effect('should handle file upload request', () =>
      E.gen(function* () {
        const store = yield* MediaStore
        const mockFile = new File(['test'], 'test.mp4', { type: 'video/mp4' })
        const request = {
          file: [mockFile],
          language: 'es',
        }
        const result = yield* store.parseMedia(request)

        expect(result.json).toHaveLength(3)
        expect(result.json[0]?.start).toBe(0)
        expect(result.json[0]?.end).toBe(5000)
      }).pipe(E.provide(MediaStore.Default), E.provide(MockConfigLayer)),
    )
  })
})
