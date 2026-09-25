import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { SlideUp } from "@/components/animations/SlideUp";
import { ShopOrderForm } from "@/components/forms/ShopOrderForm";
import {
  BRAND,
  BRAND_EMAIL,
  BRAND_INSTAGRAM,
  brandIntro,
  brandTagline,
  formatEur,
  products,
  type Product,
} from "@/lib/shop/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "ISHKA: rituals from the water. Wild Irish Sea Moss from County Clare and Blue Lotus tincture, traceably sourced and shipped across Europe.",
};

function ProductStory({
  product,
  background,
}: {
  product: Product;
  background: "cream" | "white";
}) {
  const cardBg = background === "cream" ? "bg-white" : "bg-cream";

  return (
    <Section background={background} id={product.id}>
      <Container>
        <div className="max-w-2xl mx-auto">
          <SlideUp>
            <div className="text-center mb-14">
              <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-3">
                {product.name}
              </h2>
              <p className="font-serif italic text-xl md:text-2xl text-espresso/60 mb-4">
                {product.tagline}
              </p>
              <p className="font-sans text-xs uppercase tracking-widest text-sage">
                {formatEur(product.priceEur)} · {product.size}
              </p>
            </div>
          </SlideUp>

          <div className="space-y-10">
            {product.story.map((s) => (
              <SlideUp key={s.heading}>
                <h3 className="font-sans text-xs uppercase tracking-widest text-sage mb-3">
                  {s.heading}
                </h3>
                <p className="font-sans text-base leading-[1.85] text-espresso/75">
                  {s.body}
                </p>
              </SlideUp>
            ))}
          </div>

          <SlideUp>
            <div className="bg-sage/10 rounded-3xl p-8 md:p-10 mt-14 text-center">
              <h3 className="font-sans text-xs uppercase tracking-widest text-sage mb-4">
                The ritual
              </h3>
              <p className="font-serif italic text-xl md:text-2xl leading-relaxed text-espresso/80">
                {product.ritual}
              </p>
            </div>
          </SlideUp>

          <SlideUp>
            <div className={`${cardBg} rounded-2xl border border-sand/40 p-6 mt-6`}>
              <h3 className="font-sans text-xs uppercase tracking-widest text-espresso/50 mb-2">
                A note of care
              </h3>
              <p className="font-sans text-sm leading-relaxed text-espresso/70">
                {product.care}
              </p>
            </div>
          </SlideUp>

          <div className="text-center mt-12">
            <Button href="#order" variant="primary" size="lg">
              {product.ctaLabel} →
            </Button>
          </div>
        </div>
      </Container>
    </Section>
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
            <h1 className="font-serif text-5xl md:text-6xl leading-tight mb-8">
              {brandTagline}
            </h1>
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-espresso/80 mb-10">
              {brandIntro}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {products.map((p, i) => (
                <Button
                  key={p.id}
                  href={`#${p.id}`}
                  variant={i === 0 ? "primary" : "outline"}
                  size="lg"
                >
                  {p.name}
                </Button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {products.map((p, i) => (
        <ProductStory
          key={p.id}
          product={p}
          background={i % 2 === 0 ? "cream" : "white"}
        />
      ))}

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
            From Ireland to Lisbon · Shipping across Europe ·{" "}
            <a
              href={`https://instagram.com/${BRAND_INSTAGRAM}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-terracotta transition-colors"
            >
              @{BRAND_INSTAGRAM}
            </a>{" "}
            ·{" "}
            <a
              href={`mailto:${BRAND_EMAIL}`}
              className="underline underline-offset-2 hover:text-terracotta transition-colors"
            >
              {BRAND_EMAIL}
            </a>
          </p>
        </Container>
      </Section>
    </>
  );
}
