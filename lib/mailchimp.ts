import crypto from "crypto";

export interface MailchimpMember {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  /** "subscribed" | "pending" — only applied to NEW members. Existing members keep their status. */
  statusIfNew?: "subscribed" | "pending";
}

export class MailchimpError extends Error {
  status: number;
  detail?: string;
  constructor(status: number, message: string, detail?: string) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

function getCredentials() {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  if (!apiKey || !audienceId) return null;
  const dc = apiKey.split("-")[1];
  if (!dc) return null;
  return { apiKey, audienceId, dc };
}

function authHeader(apiKey: string) {
  return "Basic " + Buffer.from(`anystring:${apiKey}`).toString("base64");
}

function subscriberHash(email: string) {
  return crypto.createHash("md5").update(email.toLowerCase()).digest("hex");
}

/**
 * Upsert a member into the configured Mailchimp audience. New members get
 * the provided status (default "subscribed"); existing members keep their
 * current status. Tags are added on top — never removed.
 */
export async function upsertMailchimpMember(member: MailchimpMember) {
  const creds = getCredentials();
  if (!creds) throw new MailchimpError(503, "Mailchimp not configured");

  const { apiKey, audienceId, dc } = creds;
  const auth = authHeader(apiKey);
  const hash = subscriberHash(member.email);

  const mergeFields: Record<string, string> = {};
  if (member.firstName) mergeFields.FNAME = member.firstName;
  if (member.lastName) mergeFields.LNAME = member.lastName;

  const memberRes = await fetch(
    `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members/${hash}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify({
        email_address: member.email,
        status_if_new: member.statusIfNew || "subscribed",
        ...(Object.keys(mergeFields).length ? { merge_fields: mergeFields } : {}),
      }),
    }
  );

  if (!memberRes.ok) {
    const data = await memberRes.json().catch(() => ({}));
    throw new MailchimpError(
      memberRes.status,
      data.title || `Mailchimp ${memberRes.status}`,
      data.detail
    );
  }

  if (member.tags && member.tags.length > 0) {
    const tagsRes = await fetch(
      `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members/${hash}/tags`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: auth },
        body: JSON.stringify({
          tags: member.tags.map((t) => ({ name: t, status: "active" })),
        }),
      }
    );
    if (!tagsRes.ok && tagsRes.status !== 204) {
      const data = await tagsRes.json().catch(() => ({}));
      console.error("[mailchimp] Failed to apply tags", tagsRes.status, data);
      // Member was added successfully; tag failure is not fatal.
    }
  }
}

export function isMailchimpConfigured(): boolean {
  return getCredentials() !== null;
}
