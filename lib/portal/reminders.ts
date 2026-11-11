// Shared by the daily reminder job and Niamh's "Send me a test" button.

export const DEFAULT_TIMEZONE = "Europe/Lisbon";
export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const WEEKDAY: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

export function isTimezone(tz: string) {
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

// Today's date (YYYY-MM-DD) and weekday (1 = Monday) in someone's time zone.
export function todayIn(tz: string | null, now = new Date()) {
  const timeZone = tz && isTimezone(tz) ? tz : DEFAULT_TIMEZONE;
  const date = new Intl.DateTimeFormat("en-CA", { timeZone }).format(now);
  const weekday = WEEKDAY[new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "short" }).format(now)];
  return { date, weekday };
}

function listOf(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Niamh's message, written in the portal with the same simple formatting as
// everywhere else, turned into an email. {name} and {practice} are filled in.
export function renderReminder(
  template: string,
  { fullName, practices, portalUrl }: { fullName: string | null; practices: string[]; portalUrl: string }
) {
  const name = fullName?.trim().split(/\s+/)[0] || "there";
  const practice = listOf(practices);
  const fill = (s: string, esc: (v: string) => string) =>
    s.replace(/\{name\}/g, esc(name)).replace(/\{practice\}/g, esc(practice));

  const footer = `See your practice days, or switch reminders off: ${portalUrl}`;
  const text = `${fill(template, (v) => v)}\n\n—\n${footer}`;

  const inline = (line: string) =>
    line
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" style="color:#B5654A">$1</a>');
  const body = fill(escapeHtml(template), escapeHtml)
    .split(/\n\s*\n/)
    .map((para) => {
      const lines = para.split("\n");
      if (lines.every((l) => /^\s*[*-]\s+/.test(l))) {
        return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[*-]\s+/, ""))}</li>`).join("")}</ul>`;
      }
      return `<p>${lines.map(inline).join("<br>")}</p>`;
    })
    .join("");

  const html = `<div style="font-family:Georgia,serif;font-size:17px;line-height:1.6;color:#3B2F2A;max-width:560px">${body}<p style="font-family:Arial,sans-serif;font-size:12px;color:#8A7B72;margin-top:32px;border-top:1px solid #E8DFD3;padding-top:12px"><a href="${escapeHtml(portalUrl)}" style="color:#8A7B72">See your practice days, or switch reminders off</a></p></div>`;

  return { subject: `Your practice today: ${practice}`, text, html };
}
