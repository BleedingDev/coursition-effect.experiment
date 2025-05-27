import { HttpApi, HttpApiEndpoint, HttpApiGroup } from '@effect/platform'
import { JobResultNotFound } from './jobs-error'
import { JobResponse, JobResultResponse, JobsResponse } from './jobs-schema'
import { MediaEmpty, MediaNotFound } from './media-error'
import { MediaResponse, UnifiedMediaRequest } from './media-schema'
import { idParam } from './schema'

const parseMedia = HttpApiEndpoint.post('parseMedia', '/parse')
  .setPayload(UnifiedMediaRequest)
  .addSuccess(MediaResponse)
const jobs = HttpApiEndpoint.get('getJobs', '/jobs').addSuccess(JobsResponse)
const job = HttpApiEndpoint.get('getJob')`/job/${idParam}`
  .addSuccess(JobResponse)
  .addError(MediaNotFound, { status: 404 })
const jobResult = HttpApiEndpoint.get('getJobResult')`/job/${idParam}/result`
  .addSuccess(JobResultResponse)
  .addError(JobResultNotFound, { status: 404 })
  .addError(MediaEmpty, { status: 422 })

const parseGroup = HttpApiGroup.make('media')
  .add(parseMedia)
  .add(jobs)
  .add(job)
  .add(jobResult)
  .prefix('/media')

export const api = HttpApi.make('v1Api').add(parseGroup)
