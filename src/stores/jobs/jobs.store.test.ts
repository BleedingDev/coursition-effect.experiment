import { describe, expect, it } from '@effect/vitest'
import { Effect as E, Exit, Cause } from 'effect'
import { MockConfigLayer } from '../../config.js'
import { JobNotFoundError, JobResultNotFoundError } from '../../domain/jobs/jobs.errors.js'
import { JobsStore } from './jobs.store.js'

describe('JobsStore', () => {
  describe('getAllJobs', () => {
    it.effect('should return list of jobs', () =>
      E.gen(function* () {
        const store = yield* JobsStore
        const result = yield* store.getAllJobs()

        expect(result.jobs).toHaveLength(3)
        expect(result.jobs[0]?.name).toBe('Parse Video 1')
        expect(result.jobs[0]?.status).toBe('completed')
      }).pipe(E.provide(JobsStore.Default), E.provide(MockConfigLayer)),
    )
  })

  describe('getJobById', () => {
    it.effect('should return job when found', () =>
      E.gen(function* () {
        const store = yield* JobsStore
        const result = yield* store.getJobById(1)

        expect(result.id).toBe(1)
        expect(result.name).toBe('Job 1')
        expect(result.status).toBe('in-progress')
      }).pipe(E.provide(JobsStore.Default), E.provide(MockConfigLayer)),
    )

    it.effect('should handle not found error', () =>
      E.gen(function* () {
        const store = yield* JobsStore
        const result = yield* store.getJobById(999).pipe(E.exit)

        expect(Exit.isFailure(result)).toBe(true)
        if (Exit.isFailure(result)) {
          const cause = result.cause
          if (cause._tag === "Fail") {
            expect((cause as Cause.Fail<JobNotFoundError>).error._tag).toBe('JobNotFoundError')
          } else {
            throw new Error('Expected cause to be a Fail type but got ' + cause._tag)
          }
        }
      }).pipe(E.provide(JobsStore.Default), E.provide(MockConfigLayer)),
    )
  })

  describe('getJobResult', () => {
    it.effect('should return result for completed job', () =>
      E.gen(function* () {
        const store = yield* JobsStore
        const result = yield* store.getJobResult(1)

        expect(result.id).toBe(1)
        expect(result.result).toBe('Result for job 1')
      }).pipe(
        E.provide(
          JobsStore.makeTestService({
            getJobById: (id) =>
              E.succeed({
                id,
                name: `Job ${id}`,
                status: 'completed',
              }),
            getJobResult: (jobId) =>
              E.succeed({
                id: jobId,
                result: `Result for job ${jobId}`,
              }),
          }),
        ),
        E.provide(MockConfigLayer),
      ),
    )

    it.effect('should handle result not found for incomplete job', () =>
      E.gen(function* () {
        const store = yield* JobsStore
        const result = yield* store.getJobResult(2).pipe(E.exit)

        expect(Exit.isFailure(result)).toBe(true)
        if (Exit.isFailure(result)) {
          const cause = result.cause
          if (cause._tag === "Fail") {
            expect((cause as Cause.Fail<JobResultNotFoundError>).error._tag).toBe('JobResultNotFoundError')
          } else {
            throw new Error('Expected cause to be a Fail type but got ' + cause._tag)
          }
        }
      }).pipe(
        E.provide(
          JobsStore.makeTestService({
            getJobById: (id) =>
              E.succeed({
                id,
                name: `Job ${id}`,
                status: 'in-progress',
              }),
            getJobResult: (jobId) => new JobResultNotFoundError({ jobId }),
          }),
        ),
        E.provide(MockConfigLayer),
      ),
    )
  })
})
