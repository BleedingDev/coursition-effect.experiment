import { HttpApi, HttpApiEndpoint, HttpApiGroup } from '@effect/platform'
import { idParam } from './domain/common/schema'
import { JobNotFound, JobResultNotFound } from './domain/jobs/jobs.errors'
import {
  JobResponse,
  JobResultResponse,
  JobsResponse,
} from './domain/jobs/jobs.schema'
import { MediaEmpty } from './domain/media/media.errors'
import { MediaResponse, UnifiedMediaRequest } from './domain/media/media.schema'
import {ProcessVideoRequest, ProcessVideoResponse} from "./domain/workflow/worflow.schema.ts";
import {WorkflowError} from "./domain/workflow/worflow.errors.ts";

const parseMedia = HttpApiEndpoint.post('parseMedia', '/parse')
  .setPayload(UnifiedMediaRequest)
  .addSuccess(MediaResponse)
  .addError(MediaEmpty, { status: 422 })
const processVideo = HttpApiEndpoint.post('processVideo', '/process')
  .setPayload(ProcessVideoRequest)
  .addSuccess(ProcessVideoResponse)
  .addError(WorkflowError, { status: 422 })
const jobs = HttpApiEndpoint.get('getJobs', '/jobs').addSuccess(JobsResponse)
const job = HttpApiEndpoint.get('getJob')`/job/${idParam}`
  .addSuccess(JobResponse)
  .addError(JobNotFound, { status: 404 })
const jobResult = HttpApiEndpoint.get('getJobResult')`/job/${idParam}/result`
  .addSuccess(JobResultResponse)
  .addError(JobResultNotFound, { status: 404 })
  .addError(JobNotFound, { status: 404 })

const parseGroup = HttpApiGroup.make('media')
  .add(parseMedia)
  .add(processVideo)
  .add(jobs)
  .add(job)
  .add(jobResult)
  .prefix('/media')

export const api = HttpApi.make('v1Api').add(parseGroup)
