// Shared logic for the "Book Now" CTA on events.
//
// If an event has a `bookingUrl` (Eventbrite, a Stripe payment link, a Google
// Form, etc.) the button opens it in a new tab. If it's blank, the button falls
// back to the prefilled contact form. Sold-out events point to a waitlist
// enquiry; cancelled events get no button.

export interface BookingTarget {
  href: string;
  external: boolean;
  label: string;
}

interface BookingInput {
  title: string;
  bookingUrl?: string;
  status?: string;
  /** True when the event takes card payment on the site (see the event schema). */
  paidOnline?: boolean;
  slug?: string;
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
  paidOnline,
  slug,
}: BookingInput): BookingTarget | null {
  if (status === "cancelled") return null;

  if (status === "sold-out") {
    return {
      href: contactSubject("Waitlist", title),
      external: false,
      label: "Join Waitlist",
    };
  }

  // Paying happens on the event's own page, so a card sends people there rather
  // than to the enquiry form. Checked before bookingUrl: if both are set,
  // taking the payment directly is what was asked for.
  if (paidOnline && slug) {
    return { href: `/events/${slug}`, external: false, label: "Book Now" };
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
