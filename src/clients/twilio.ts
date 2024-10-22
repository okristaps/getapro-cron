import twilio from "twilio";

export class TwilioClient {
  private client: twilio.Twilio;
  private fromNumber: string;

  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.client = twilio(accountSid, authToken);
    this.fromNumber = fromNumber;
  }

  async sendSms(to: string, message: string) {
    try {
      const sms = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: to,
      });
      console.log("SMS sent successfully:", sms.sid);
    } catch (error) {
      console.error("Failed to send SMS:", error);
    }
  }
}
