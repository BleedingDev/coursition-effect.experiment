import { Schema } from 'effect'

export class MediaEmpty extends Schema.TaggedError<MediaEmpty>()(
  'MediaEmpty',
  {},
) {}

export class MediaNotFound extends Schema.TaggedError<MediaNotFound>()(
  'MediaNotFound',
  {},
) {}
