import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center">
      <Container>
        <div className="text-center max-w-lg mx-auto">
          <p className="font-sans text-sm uppercase tracking-widest text-sage mb-4">
            404
          </p>
          <h1 className="font-serif text-5xl md:text-6xl mb-4">
            Page Not Found
          </h1>
          <p className="font-sans text-base text-espresso/60 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/" variant="primary">
              Go Home
            </Button>
            <Button href="/contact" variant="outline">
              Get in Touch
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
