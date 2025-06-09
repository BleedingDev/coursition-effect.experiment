import {Effect as E, type Schema} from 'effect'
import {ProcessVideoRequest} from "../../domain/workflow/worflow.schema.ts";
import {WorkflowStore} from "../../stores/workflow/workflowStore.ts";

type ProcessVideoRequestType = Schema.Schema.Type<typeof ProcessVideoRequest>

export const processVideoUsecase = (request: ProcessVideoRequestType) =>
  E.gen(function* () {
    const workflowStore = yield* WorkflowStore
    const result = yield* workflowStore.processVideo(request)
    return result
  }).pipe(
    E.tapError(E.logError),
    E.orDie, // Die on any unexpected errors
    E.withSpan('processVideoUsecase', {
      attributes: {},
    }),
  )
