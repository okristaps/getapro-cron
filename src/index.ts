import checkForNewJobs from "./jobs/fetchForJobs";

export interface Env {
  TWILIO_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_NUMBER_FROM: string;
  TWILIO_PHONE_TO: string;
  API_URL: string;
  GETAPRO_JOBS: KVNamespace;
}

export default {
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    await checkForNewJobs(env);
  },
};
