import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { SubstackIcon } from "@/components/ui/icons/SubstackIcon";
import { getLatestSubstackPosts } from "@/lib/substack";

const SUBSTACK_URL = "https://thelittlemoments.substack.com/";

function stripHtml(input?: string): string {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, "").trim();
}

export async function SubstackSection() {
  const posts = await getLatestSubstackPosts(8);

  if (posts.length === 0) {
    return null;
  }

  return (
    <Section background="white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-end">
          <div className="lg:col-span-7">
            <p className="font-sans text-xs uppercase tracking-widest text-terracotta mb-4 flex items-center gap-2">
              <SubstackIcon size={14} />
              Substack
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] mb-5">
              The Little Moments
            </h2>
            <p className="font-sans text-base md:text-lg text-espresso/70 leading-relaxed max-w-2xl">
              Your spicy holistic health coach who adds a little extra chilli to
              navigating the complexities of what society tells us is &lsquo;healthy&rsquo;
              while weaving mindfulness and sensuality into it all.
            </p>
          </div>
          <div className="lg:col-span-5 flex lg:justify-end">
            <Button href={SUBSTACK_URL} variant="primary">
              Subscribe on Substack
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {posts.map((post) => {
            const summary = stripHtml(post.description) || post.subtitle || "";
            return (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col"
              >
                <div className="relative aspect-[4/5] bg-sand/30 rounded-2xl mb-4 overflow-hidden">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-espresso/20">
                      <SubstackIcon size={32} />
                    </div>
                  )}
                </div>
                <h3 className="font-serif text-xl leading-snug mb-2 group-hover:text-terracotta transition-colors">
                  {post.title}
                </h3>
                {summary && (
                  <p className="font-sans text-sm text-espresso/60 leading-relaxed line-clamp-3">
                    {summary}
                  </p>
                )}
              </a>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
