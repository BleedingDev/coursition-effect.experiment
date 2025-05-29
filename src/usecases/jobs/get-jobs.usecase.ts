import { Effect as E } from 'effect'
import { JobsStore } from '../../stores/jobs/jobs.store.js'

export const getJobsUsecase = () =>
  E.gen(function* () {
    const jobsStore = yield* JobsStore
    const result = yield* jobsStore.getAllJobs()
    return result
  }).pipe(
    E.tapError(E.logError),
    E.orDie, // No expected domain errors for listing
    E.withSpan('getJobsUsecase'),
  )
