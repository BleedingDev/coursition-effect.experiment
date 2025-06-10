// src/handlers/video-processing.ts
import {Effect as E, Schema} from 'effect'
import {ProcessVideoRequest} from "../../domain/workflow/worflow.schema.ts";
import {processVideoUsecase} from "../../usecases/workflow/process-video.usecase.ts";
import {WorkflowError} from "../../domain/workflow/worflow.errors.ts";

type ProcessVideoRequestType = Schema.Schema.Type<typeof ProcessVideoRequest>

export const processVideoHandler = (request: ProcessVideoRequestType) =>
  E.gen(function* () {
    const result = yield* processVideoUsecase(request)
    return result
  }).pipe(
    E.catchAll(() => new WorkflowError()),
    E.tapError(E.logError),
    E.withSpan('processVideoHandler', {
      attributes: {},
    }),
  )

