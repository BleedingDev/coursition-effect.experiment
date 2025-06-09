import {Context, Effect as E, type Schema} from 'effect'
import {ProcessVideoRequest, ProcessVideoResponse} from "../../domain/workflow/worflow.schema.ts";
import {WorkflowError} from "../../domain/workflow/worflow.errors.ts";

type ProcessVideoRequestType = Schema.Schema.Type<typeof ProcessVideoRequest>

export class WorkflowStore extends Context.Tag('WorkflowStore')<
  WorkflowStore,
  {
    readonly processVideo: (
      request: ProcessVideoRequestType,
    ) => E.Effect<Schema.Schema.Type<typeof ProcessVideoResponse>, WorkflowError>
  }
>() {
  static RestateStore = WorkflowStore.of({
    processVideo: E.fn('process-video')(function* (
      request: ProcessVideoRequestType,
    ) {
      
      const response = fetch('http://localhost:9080/VideoProcessor/processVideo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })
      
      return ProcessVideoResponse.make({
        response: response,
      })
    }),
  })
}


