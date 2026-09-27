// Shared logic for the "Book Now" CTA on events.
//
// If an event has a `bookingUrl` (Eventbrite, a Stripe payment link, a Google
// Form, etc.) the button opens it in a new tab. If it's blank, the button falls
// back to the prefilled contact form. Sold-out events point to a waitlist
// enquiry; cancelled events get no button.

/**
 * Has a retreat already happened?
 *
 * Retreats, unlike workshops and classes, are not filtered out of the site once
 * their date passes — they stay up as a record of past work. This decides when
 * to show them as finished instead of still bookable.
 *
 * Multi-day retreats use the end date, so one is not marked finished while it
 * is still running.
 */
export function hasFinished(dateStart?: string, dateEnd?: string): boolean {
  const last = dateEnd || dateStart;
  if (!last) return false;
  const time = new Date(last).getTime();
  if (Number.isNaN(time)) return false;
  return time < Date.now();
}

/** Shown wherever a retreat has finished. */
export const FINISHED_RETREAT_MESSAGE =
  "This retreat is now finished — sign up to the waitlist to be the first to know when the next retreat goes live.";

export interface BookingTarget {
  href: string;
  external: boolean;
  label: string;
}

interface BookingInput {
  title: string;
  bookingUrl?: string;
  status?: string;
}

const contactSubject = (prefix: string, title: string) =>
  `/contact?subject=${encodeURIComponent(`${prefix}: ${title}`)}`;

/**
 * Resolve where an event's "Book Now" button should go.
 * Returns `null` when the event is cancelled (no CTA should render).
 */
export function getBookingTarget({
  title,
  bookingUrl,
  status,
}: BookingInput): BookingTarget | null {
  if (status === "cancelled") return null;

  if (status === "sold-out") {
    return {
      href: contactSubject("Waitlist", title),
      external: false,
      label: "Join Waitlist",
    };
  }

  if (bookingUrl) {
    return { href: bookingUrl, external: true, label: "Book Now" };
  }

  return {
    href: contactSubject("Booking", title),
    external: false,
    label: "Book Now",
  };
}
