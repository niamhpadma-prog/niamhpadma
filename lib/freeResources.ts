// The free downloads offered on the home page, behind a name + email sign-up.
//
// The cycle guide's words are Niamh's own (given in chat, 2026-11-27). The
// mindful nutrition ebook is not listed here: it comes from Sanity ("Free
// Download Pop-Up"), so its title, description, cover and PDF stay in step
// with the pop-up and she can swap them in the Studio.

export interface FreeResource {
  slug: FreeResourceSlug;
  title: string;
  description: string;
  fileUrl: string;
  coverUrl?: string;
  coverAlt?: string;
}

// Allow-list shared with /api/free-resources, which tags each sign-up in
// Mailchimp with the resource it came from.
export const FREE_RESOURCE_SLUGS = ["nourishing-your-cycle", "mindful-nutrition"] as const;
export type FreeResourceSlug = (typeof FREE_RESOURCE_SLUGS)[number];

export const nourishingYourCycle: FreeResource = {
  slug: "nourishing-your-cycle",
  title: "Nourishing Your Cycle",
  description:
    "What to eat during each phase of your cycle to nourish your body, as well as tips and insights beyond the plate based on nutritional therapy.",
  fileUrl: "/resources/nourishing-your-cycle.pdf",
  coverUrl: "/images/resources/nourishing-your-cycle.jpg",
  coverAlt: "Nourishing Your Cycle guide: the foods for each of the five phases",
};
