import {Context, Effect as E, type Schema} from 'effect'
import {ProcessVideoResponse, StartProcessRequest, StartProcessResponse} from "../../domain/workflow/worflow.schema.ts";
import {WorkflowError} from "../../domain/workflow/worflow.errors.ts";
import * as clients from "@restatedev/restate-sdk-clients";

type StartProcessRequestType = Schema.Schema.Type<typeof StartProcessRequest>

export class WorkflowStore extends Context.Tag('WorkflowStore')<
  WorkflowStore,
  {
    readonly startPropcess: (
      request: StartProcessRequestType,
    ) => E.Effect<Schema.Schema.Type<typeof StartProcessResponse>, WorkflowError>
  }
>() {
  static RestateStore = WorkflowStore.of({
    startPropcess: E.fn('start-process')(function* (
      request: StartProcessRequestType,
    ) {
      
      //TODO: Base URL from ENV param + solve auth
      const rs = clients.connect({ url: "http://localhost:8080" });
      
      const response =  rs
        .serviceClient(request.processDefinition).process(request.props)
      
      return ProcessVideoResponse.make({
        response: response,
      })
    }),
  })
}


