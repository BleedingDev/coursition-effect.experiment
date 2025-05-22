import { Schema } from "effect";

export const JobResponse = Schema.Struct({
	id: Schema.Number,
	name: Schema.String,
	status: Schema.String,
});

export const JobsResponse = Schema.Struct({
	jobs: Schema.Array(
		Schema.Struct({
			id: Schema.Number,
			name: Schema.String,
			status: Schema.String,
		}),
	),
});
