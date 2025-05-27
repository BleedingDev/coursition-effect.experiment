import { Schema } from 'effect'

export class JobResultNotFound extends Schema.TaggedError<JobResultNotFound>()(
  'JobResultNotFound',
  {},
) {}
