import { Schema } from "effect";
import {
	HttpApi,
	HttpApiEndpoint,
	HttpApiGroup,
	HttpApiSchema,
	Multipart,
} from "@effect/platform";

// Schemas for requests that include file uploads
const ParseMediaRequest = HttpApiSchema.Multipart(
	Schema.Struct({
		file: Multipart.FilesSchema,
		language: Schema.String,
	}),
);

const ParseDocumentRequest = HttpApiSchema.Multipart(
	Schema.Struct({
		file: Multipart.FilesSchema,
		description: Schema.String,
		language: Schema.String,
	}),
);

// Schemas for regular JSON body requests
const ParsePublicMediaRequest = Schema.Struct({
	url: Schema.String,
	language: Schema.String,
});

const ParseWebRequest = Schema.Struct({
	url: Schema.String,
});

const SuccessResponse = Schema.Struct({
	message: Schema.String,
});

// API Definition
export const api = HttpApi.make("ParserAPI").add(
	HttpApiGroup.make("Parser")
		.add(
			HttpApiEndpoint.post("parseMedia", "/parse/media")
				.setPayload(ParseMediaRequest) // Corrected: Using setPayload
				.addSuccess(SuccessResponse),
		)
		.add(
			HttpApiEndpoint.post("parsePublicMedia", "/parse/public-media")
				.setPayload(ParsePublicMediaRequest) // Corrected: Using setPayload
				.addSuccess(SuccessResponse),
		)
		.add(
			HttpApiEndpoint.post("parseWeb", "/parse/web")
				.setPayload(ParseWebRequest) // Corrected: Using setPayload
				.addSuccess(SuccessResponse),
		)
		.add(
			HttpApiEndpoint.post("parseDocument", "/parse/document")
				.setPayload(ParseDocumentRequest) // Corrected: Using setPayload
				.addSuccess(SuccessResponse),
		),
);
