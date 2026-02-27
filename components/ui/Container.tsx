import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "main";
}

export function Container({ children, className = "", as: Tag = "div" }: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full max-w-[1440px] px-[clamp(1.5rem,4vw,4rem)] ${className}`}
    >
      {children}
    </Tag>
  );
}
