"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessResponse = exports.ParseDocumentRequest = exports.ParseWebRequest = exports.ParsePublicMediaRequest = exports.ParseMediaRequest = exports.api = void 0;
var schema_1 = require("@effect/schema");
var platform_1 = require("@effect/platform");
// Schemas for requests that include file uploads
var ParseMediaRequest = platform_1.HttpApiSchema.Multipart(schema_1.Schema.Struct({
    file: platform_1.Multipart.FilesSchema, // Assuming 'file' is the field name for one or more files
    language: schema_1.Schema.String,
}));
exports.ParseMediaRequest = ParseMediaRequest;
var ParseDocumentRequest = platform_1.HttpApiSchema.Multipart(schema_1.Schema.Struct({
    file: platform_1.Multipart.FilesSchema, // Assuming 'file' is the field name for one or more files
    description: schema_1.Schema.String,
    language: schema_1.Schema.String,
}));
exports.ParseDocumentRequest = ParseDocumentRequest;
// Schemas for regular JSON body requests
var ParsePublicMediaRequest = schema_1.Schema.Struct({
    url: schema_1.Schema.String,
    language: schema_1.Schema.String,
});
exports.ParsePublicMediaRequest = ParsePublicMediaRequest;
var ParseWebRequest = schema_1.Schema.Struct({
    url: schema_1.Schema.String,
});
exports.ParseWebRequest = ParseWebRequest;
var SuccessResponse = schema_1.Schema.Struct({
    message: schema_1.Schema.String,
    // In a real scenario, you'd have more specific success schemas per endpoint
});
exports.SuccessResponse = SuccessResponse;
// API Definition
var api = platform_1.HttpApi.make({ title: "ParserAPI" }).pipe(platform_1.HttpApi.add(platform_1.HttpApiGroup.make("Parser").pipe(platform_1.HttpApiGroup.add(platform_1.HttpApiEndpoint.post("parseMedia", "/parse/media").pipe(platform_1.HttpApiEndpoint.setPayload(ParseMediaRequest), // Use setPayload for multipart
platform_1.HttpApiEndpoint.addSuccess(SuccessResponse))), platform_1.HttpApiGroup.add(platform_1.HttpApiEndpoint.post("parsePublicMedia", "/parse/public-media").pipe(platform_1.HttpApiEndpoint.setRequestBody(ParsePublicMediaRequest), // Use setRequestBody for JSON
platform_1.HttpApiEndpoint.addSuccess(SuccessResponse))), platform_1.HttpApiGroup.add(platform_1.HttpApiEndpoint.post("parseWeb", "/parse/web").pipe(platform_1.HttpApiEndpoint.setRequestBody(ParseWebRequest), // Use setRequestBody for JSON
platform_1.HttpApiEndpoint.addSuccess(SuccessResponse))), platform_1.HttpApiGroup.add(platform_1.HttpApiEndpoint.post("parseDocument", "/parse/document").pipe(platform_1.HttpApiEndpoint.setPayload(ParseDocumentRequest), // Use setPayload for multipart
platform_1.HttpApiEndpoint.addSuccess(SuccessResponse))))));
exports.api = api;
// Client Derivation (example usage, typically in a different file/module)
// const clientEffect = HttpApiClient.make(api, { baseUrl: "http://localhost:3000" });
// To make the client available through context:
// export class ParserApiClient extends Context.Tag("ParserApiClient")<ParserApiClient, HttpApiClient.TypeOf<typeof api>>() {}
// Example of how you might provide a layer for the client
// import { FetchHttpClient } from "@effect/platform"; // Needs an HttpClient implementation
// export const ParserApiClientLive = Layer.effect(
//   ParserApiClient,
//   HttpApiClient.make(api, { baseUrl: "http://localhost:3000" }).pipe(Effect.provide(FetchHttpClient.layer))
// );
