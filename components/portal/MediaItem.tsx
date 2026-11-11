import type { Resource } from "@/lib/portal/corner";

const LABEL: Record<Resource["kind"], string> = {
  audio: "Audio",
  video: "Video",
  file: "File",
  link: "Link",
};

export function MediaItem({ resource }: { resource: Resource }) {
  const { kind, title, description, href } = resource;

  return (
    <div className="bg-cream rounded-[14px] px-4 py-3.5 my-3">
      <div className="font-medium">{title}</div>
      <div className="text-[13px] text-espresso-light">
        {LABEL[kind]}
        {description ? ` · ${description}` : ""}
      </div>
      {!href ? (
        <p className="text-[13px] text-espresso-light mt-2">Coming soon.</p>
      ) : kind === "audio" ? (
        <audio controls preload="metadata" src={href} className="w-full mt-2 h-10" />
      ) : kind === "video" ? (
        <video controls preload="metadata" src={href} className="w-full mt-2 rounded-lg" />
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-[13px] text-terracotta-dark underline underline-offset-2"
        >
          {kind === "file" ? "Open file" : "Open link"}
        </a>
      )}
    </div>
  );
}
