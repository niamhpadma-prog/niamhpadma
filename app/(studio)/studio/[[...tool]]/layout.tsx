export const metadata = {
  title: "Niamh Padma — Studio",
  description: "Content management studio",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={{ margin: 0, height: "100vh" }}>{children}</div>;
}
