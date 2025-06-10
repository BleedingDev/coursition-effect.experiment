import {Schema} from 'effect'
import type {Context, ServiceDefinition} from "@restatedev/restate-sdk";


export const ProcessVideoRequest = Schema.Struct({
  videoUrl: Schema.String,
})

export const ProcessVideoResponse = Schema.Struct({

})

export const ServiceDefinitionSchema = Schema.declare<ServiceDefinition<string, {
  process: (ctx: Context, args: any) =>
  Promise<any>
}>>(
  (input): input is ServiceDefinition<string, ""> => {
    return typeof input === 'object' && input !== null
  }
)

export const StartProcessRequest = Schema.Struct({
  processDefinition: ServiceDefinitionSchema,
  props: Schema.Unknown,
})

export const StartProcessResponse = Schema.Struct({

})