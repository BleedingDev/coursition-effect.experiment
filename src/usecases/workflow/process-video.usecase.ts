import {Effect as E, type Schema} from 'effect'
import {ProcessVideoRequest} from "../../domain/workflow/worflow.schema.ts";
import {WorkflowStore} from "../../stores/workflow/workflowStore.ts";
import * as restate from "@restatedev/restate-sdk";

type ProcessVideoRequestType = Schema.Schema.Type<typeof ProcessVideoRequest>

export const processVideoUsecase = (request: ProcessVideoRequestType) =>
  E.gen(function* () {
    const workflowStore = yield* WorkflowStore
    const result = yield* workflowStore.startPropcess({
      processDefinition: processVideoDefinition,
      props: {
        name: "Some name",
        videoUrl: request.videoUrl,
      },
    })
    return result
  }).pipe(
    E.tapError(E.logError),
    E.orDie, // Die on any unexpected errors
    E.withSpan('processVideoUsecase', {
      attributes: {},
    }),
  )


export const processVideoDefinition = restate.service({
  name: "ProcessVideo",
  handlers: {
    process: async (ctx: restate.Context, props: {name: string}) => {
      // Durably execute a set of steps; resilient against failures
      const greetingId = ctx.rand.uuidv4();
      await ctx.run(() => sendNotification(greetingId, props.name));
      await ctx.sleep(1000);
      await ctx.run(() => sendReminder(greetingId));
      
      // Respond to caller
      return `You said hi to ${props.name}!`;
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