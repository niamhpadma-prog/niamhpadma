import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ShopOrderForm } from "@/components/forms/ShopOrderForm";
import {
  BRAND,
  brandPrinciples,
  formatEur,
  products,
  type Product,
} from "@/lib/shop/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "ISHKA wild-harvested Irish Sea Moss and Egyptian Blue Lotus tincture. One ritual for the body, one for the evening.",
};

const feelings = ["grounded", "clear", "nourished", "connected"];

function ProductPanel({ product }: { product: Product }) {
  return (
    <article className="bg-white rounded-3xl border border-sand/30 p-8 md:p-10 flex flex-col">
      <p className="font-sans text-xs uppercase tracking-widest text-sage mb-3">
        {product.tagline}
      </p>
      <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-2">
        {product.name}
      </h2>
      <p className="font-serif italic text-lg text-espresso/70 mb-6">
        {formatEur(product.priceEur)} · {product.size}
      </p>

      <p className="font-sans text-base leading-relaxed text-espresso/75 mb-6">
        {product.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {product.tags.map((tag) => (
          <span
            key={tag}
            className="font-sans text-[0.68rem] uppercase tracking-widest text-espresso/70 border border-sand/60 rounded-full px-3.5 py-1.5"
          >
            {tag}
          </span>
        ))}
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-8">
        {product.benefits.map((b) => (
          <li
            key={b}
            className="font-sans text-sm text-espresso/70 flex items-start gap-2"
          >
            <span className="text-sage mt-0.5">{"✓"}</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6 border-t border-sand/30">
        <h3 className="font-sans text-xs uppercase tracking-widest text-espresso/50 mb-2">
          How to use
        </h3>
        <p className="font-sans text-sm leading-relaxed text-espresso/70">
          {product.howToUse}
        </p>
      </div>
    </article>
  );
}

export default function ShopPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream-dark pt-20 pb-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-sans text-sm uppercase tracking-[0.3em] text-sage mb-6">
              {BRAND}
            </p>
            <h1 className="font-serif text-5xl md:text-6xl leading-tight mb-3">
              Two Products
            </h1>
            <p className="font-serif italic text-2xl text-espresso/60 mb-8">
              One philosophy
            </p>
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-espresso/80 mb-10">
              Water changes how we feel — it slows us down, grounds us, opens us,
              brings us back to ourselves. One ritual for the body, one for the
              evening. Together they feel both grounding and expansive.
            </p>
            <p className="font-sans text-xs uppercase tracking-widest text-espresso/45 leading-loose mb-10">
              {brandPrinciples.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <Button href="#order" variant="primary" size="lg">
              Order Now
            </Button>
          </div>
        </Container>
      </section>

      {/* Products */}
      <Section background="cream">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {products.map((p) => (
              <ProductPanel key={p.id} product={p} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Philosophy */}
      <Section background="white">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
              More than a supplement
            </h2>
            <p className="font-sans text-base leading-relaxed text-espresso/70 mb-10">
              Sea Moss and Blue Lotus each give people a ritual that feels
              connected to nature rather than disconnected from it — nourishment
              for the body, softness for the evening, and a small moment of care
              in an otherwise loud day.
            </p>
            <p className="font-serif italic text-2xl text-espresso/80 flex flex-wrap justify-center gap-x-4 gap-y-2">
              {feelings.map((f, i) => (
                <span key={f} className="flex items-center gap-4">
                  {f}
                  {i < feelings.length - 1 && (
                    <span className="text-sage" aria-hidden="true">·</span>
                  )}
                </span>
              ))}
            </p>
          </div>
        </Container>
      </Section>

      {/* Order form */}
      <Section background="cream" id="order">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="font-sans text-sm uppercase tracking-widest text-sage mb-4">
              Order
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-4">
              One small ritual at a time
            </h2>
            <p className="font-sans text-base text-espresso/60 leading-relaxed">
              Choose one or both, add your details, and Niamh will be in touch to
              confirm your order.
            </p>
          </div>
          <ShopOrderForm />
          <p className="font-sans text-xs text-espresso/40 text-center mt-12">
            {BRAND} · Ireland ·{" "}
            <a
              href="https://instagram.com/ishka_org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-terracotta transition-colors"
            >
              @ishka_org
            </a>
          </p>
        </Container>
      </Section>
    </>
  );
}
