import { load } from "cheerio";
import { Env } from "src";
import { TwilioClient } from "src/clients/twilio";

async function checkForNewJobs(env: Env) {
  const twilioClient = new TwilioClient(env.TWILIO_SID, env.TWILIO_AUTH_TOKEN, env.TWILIO_NUMBER_FROM);

  try {
    const response = await fetch(env.API_URL);
    const html = await response.text();
    const $ = load(html);
    const jobElements = $(".job-list-item");

    let currentJobIds = new Set<string>();
    let newJobsFound = false;

    const storedJobIds = await env.GETAPRO_JOBS.get("lastJobIds");
    console.log("storedJobIds", storedJobIds);
    const lastJobIds = storedJobIds ? new Set(JSON.parse(storedJobIds)) : new Set();

    jobElements.each((index, element) => {
      const jobId = $(element).attr("data-id");
      const jobTitle = $(element).attr("data-name");

      if (jobId) {
        currentJobIds.add(jobId);
        if (!lastJobIds.has(jobId)) {
          console.log(`New Job Found: ${jobTitle} (ID: ${jobId})`);
          newJobsFound = true;
        }
      }
    });

    if (newJobsFound) {
      await twilioClient.sendSms(
        env.TWILIO_PHONE_TO,
        `New job listings have been added. Check them out at ${env.API_URL}`
      );
    } else {
      console.log("No new jobs found.");
    }

    await env.GETAPRO_JOBS.put("lastJobIds", JSON.stringify(Array.from(currentJobIds)));
  } catch (error) {
    console.error("Error fetching or parsing jobs:", error);
  }
}

export default checkForNewJobs;
