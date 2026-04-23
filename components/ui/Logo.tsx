interface LogoProps {
  className?: string;
  color?: "espresso" | "cream";
  size?: number;
}

export function Logo({ className = "", color = "espresso", size = 28 }: LogoProps) {
  const backgroundColor = color === "cream" ? "#FAF7F2" : "#3C2F2F";

  return (
    <span
      role="img"
      aria-label="Niamh Padma logo"
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        backgroundColor,
        WebkitMaskImage: "url(/logo.svg)",
        maskImage: "url(/logo.svg)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
