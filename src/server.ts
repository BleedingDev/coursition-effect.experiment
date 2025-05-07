import {
	HttpApiBuilder,
	HttpApiScalar,
	HttpMiddleware,
	HttpServer,
} from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { Effect, Layer } from "effect";
import { api } from "./api";

const mediaGroupMock = HttpApiBuilder.group(api, "media", (handlers) =>
	handlers
		.handle("parseMedia", () =>
			Effect.succeed({
				json: [],
			}),
		)
		.handle("getJobs", () =>
			Effect.succeed({
				jobs: [],
			}),
		)
		.handle("getJob", ({ path: { id } }) =>
			Effect.succeed({
				id,
				name: "job",
				status: "in-progress",
				result: "",
			}),
		),
);

const MyApiMock = HttpApiBuilder.api(api).pipe(Layer.provide(mediaGroupMock));

const HttpMock = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
	Layer.provide(HttpApiScalar.layer({})),
	Layer.provide(HttpApiBuilder.middlewareCors()),
	Layer.provide(MyApiMock),
	HttpServer.withLogAddress,
	Layer.provide(BunHttpServer.layer({ port: 3000 })),
);

Layer.launch(HttpMock).pipe(BunRuntime.runMain);
