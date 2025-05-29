import { Effect as E } from 'effect'
import { getJobsUsecase } from '../../usecases/jobs/get-jobs.usecase.js'

export const getJobsHandler = () =>
  E.gen(function* () {
    const result = yield* getJobsUsecase()
    return result
  }).pipe(E.tapError(E.logError), E.withSpan('getJobsHandler'))
