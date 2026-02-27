import Link from "next/link";
import { Container } from "@/components/ui/Container";

const footerLinks = {
  explore: [
    { label: "About", href: "/about" },
    { label: "Work With Me", href: "/work-with-me" },
    { label: "Events & Retreats", href: "/events" },
    { label: "Blog", href: "/blog" },
  ],
  services: [
    { label: "1-1 Coaching", href: "/work-with-me#coaching" },
    { label: "Group Classes", href: "/work-with-me#group" },
    { label: "Workshops", href: "/work-with-me#workshops" },
    { label: "Corporate Wellness", href: "/work-with-me#corporate" },
  ],
  connect: [
    { label: "Contact", href: "/contact" },
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-espresso text-cream/80 py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <Link href="/" className="font-serif text-2xl font-semibold text-cream">
              Niamh Padma
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-cream/60">
              Yoga, breathwork, somatic therapy & holistic nutrition in Lisbon.
              Guiding you home to yourself.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-cream/40 mb-4">
                {title}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-cream transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream/40">
            &copy; {new Date().getFullYear()} Niamh Padma. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-cream/40">
            <Link href="/privacy" className="hover:text-cream/60 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-cream/60 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
