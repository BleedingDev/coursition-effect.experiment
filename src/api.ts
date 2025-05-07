import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { MediaResponse, UnifiedMediaRequest } from "./media-schema";
import { idParam } from "./schema";
import { MediaEmpty, MediaNotFound } from "./media-error";
import { JobResponse, JobsResponse } from "./jobs-schema";

const parseMedia = HttpApiEndpoint.post("parseMedia", "/parse")
	.setPayload(UnifiedMediaRequest)
	.addSuccess(MediaResponse);
const jobs = HttpApiEndpoint.get("getJobs", "/jobs").addSuccess(JobsResponse);
const job = HttpApiEndpoint.get("getJob")`/job/${idParam}/result`
	.addSuccess(JobResponse)
	.addError(MediaNotFound, { status: 404 })
	.addError(MediaEmpty, { status: 422 });

const parseGroup = HttpApiGroup.make("media")
	.add(parseMedia)
	.add(jobs)
	.add(job)
	.prefix("/media");

export const api = HttpApi.make("v1Api").add(parseGroup);
