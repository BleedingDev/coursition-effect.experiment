import { HttpApiSchema, Multipart } from '@effect/platform'
import { Schema } from 'effect'

const ParseMediaFileRequest = HttpApiSchema.Multipart(
  Schema.Struct({
    file: Multipart.FileSchema,
  }),
)

const ParseMediaUrlRequest = Schema.Struct({
  url: Schema.String,
})

const ParseMediaOptions = Schema.Struct({
  language: Schema.String,
})

const ParseMediaRequest = Schema.Union(
  ParseMediaFileRequest,
  ParseMediaUrlRequest,
)

const SubtitleJson = Schema.Array(
  Schema.Struct({
    start: Schema.Number,
    end: Schema.Number,
    text: Schema.String,
  }),
)

export const UnifiedMediaRequest = Schema.extend(
  ParseMediaRequest,
  ParseMediaOptions,
)

export const MediaResponse = Schema.Struct({
  json: SubtitleJson,
})
