// src/handlers/video-processing.ts
import {Effect as E, Schema} from 'effect'
import {ProcessVideoRequest} from "../../domain/workflow/worflow.schema.ts";
import {processVideoUsecase} from "../../usecases/workflow/process-video.usecase.ts";
import {WorkflowError} from "../../domain/workflow/worflow.errors.ts";
import * as restate from "@restatedev/restate-sdk";

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


export const greeterWorkflow = restate.service({
  name: "Greeter",
  handlers: {
    greet: async (ctx: restate.Context, name: string) => {
      // Durably execute a set of steps; resilient against failures
      const greetingId = ctx.rand.uuidv4();
      await ctx.run(() => sendNotification(greetingId, name));
      await ctx.sleep(1000);
      await ctx.run(() => sendReminder(greetingId));
      
      // Respond to caller
      return `You said hi to ${name}!`;
    },
  },
})

const sendNotification = (greetingId: string, name: string) => {
  if (Math.random() < 0.5) {
    // 50% chance of failure
    console.error(`👻 Failed to send notification: ${greetingId} - ${name}`);
    throw new Error(`Failed to send notification ${greetingId} - ${name}`);
  }
  console.log(`Notification sent: ${greetingId} - ${name}`);
}

const sendReminder = (greetingId: string) => {
  if (Math.random() < 0.5) {
    // 50% chance of failure
    console.error(`👻 Failed to send reminder: ${greetingId}`);
    throw new Error(`Failed to send reminder: ${greetingId}`);
  }
  console.log(`Reminder sent: ${greetingId}`);
}
