import crypto from "crypto";

export interface MailchimpMember {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  /** Extra Mailchimp merge fields keyed by tag (e.g. { SERVICE: "coaching" }). Tags must exist in the audience. */
  mergeFields?: Record<string, string>;
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

  const nameFields: Record<string, string> = {};
  if (member.firstName) nameFields.FNAME = member.firstName;
  if (member.lastName) nameFields.LNAME = member.lastName;
  const mergeFields: Record<string, string> = { ...(member.mergeFields || {}), ...nameFields };

  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members/${hash}`;
  const putMember = (mf: Record<string, string>) =>
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify({
        email_address: member.email,
        status_if_new: member.statusIfNew || "subscribed",
        ...(Object.keys(mf).length ? { merge_fields: mf } : {}),
      }),
    });

  let memberRes = await putMember(mergeFields);

  // Custom merge fields (e.g. SERVICE/ANSWERS) may not exist in this audience yet.
  // Rather than fail the whole upsert — which would also lose the subscribe alert —
  // retry with just the name fields so the contact and tags still go through.
  if (!memberRes.ok && memberRes.status === 400 && member.mergeFields) {
    console.error("[mailchimp] member upsert 400 with custom merge fields — retrying without them");
    memberRes = await putMember(nameFields);
  }

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
