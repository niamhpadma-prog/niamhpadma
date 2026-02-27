import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: "cream" | "white" | "sage" | "espresso";
}

const backgrounds = {
  cream: "bg-cream",
  white: "bg-white",
  sage: "bg-sage/10",
  espresso: "bg-espresso text-cream",
};

export function Section({ children, className = "", id, background = "cream" }: SectionProps) {
  return (
    <section
      id={id}
      className={`py-[clamp(4rem,8vw,8rem)] ${backgrounds[background]} ${className}`}
    >
      {children}
    </section>
  );
}
