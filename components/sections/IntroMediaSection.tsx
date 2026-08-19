import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export interface IntroMedia {
  enabled?: boolean;
  heading?: string;
  body?: string;
  mediaUrl?: string;
  caption?: string;
}

// Turn a normal YouTube/Vimeo link — the kind you copy from the address bar —
// into its embed URL. Returns null for anything we don't recognise, so a
// mistyped link renders nothing rather than an error frame.
export function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
      }
      const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/);
      return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
    }
    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return /^\d+$/.test(id || "") ? `https://player.vimeo.com/video/${id}` : null;
    }
    if (host === "player.vimeo.com") return url;
    return null;
  } catch {
    return null;
  }
}

export function IntroMediaSection({ config }: { config: IntroMedia | null }) {
  if (!config?.enabled || !config.mediaUrl) return null;
  const embed = toEmbedUrl(config.mediaUrl);
  if (!embed) return null;

  return (
    <Section background="cream">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          {config.heading && (
            <h2 className="font-serif text-3xl md:text-4xl mb-4">{config.heading}</h2>
          )}
          {config.body && (
            <p className="font-sans text-base text-espresso/60 mb-8">{config.body}</p>
          )}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-espresso/5">
            <iframe
              src={embed}
              title={config.heading || "Introduction video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {config.caption && (
            <p className="font-sans text-xs text-espresso/40 mt-3">{config.caption}</p>
          )}
        </div>
      </Container>
    </Section>
  );
}
