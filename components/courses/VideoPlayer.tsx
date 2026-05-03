"use client";

interface VideoPlayerProps {
  url: string;
  title?: string;
}

function getEmbedUrl(url: string): string | null {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1`;
  }

  return null;
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div className="aspect-[16/9] bg-sand/30 rounded-2xl flex items-center justify-center">
        <p className="font-sans text-sm text-espresso/40">Video unavailable</p>
      </div>
    );
  }

  return (
    <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-espresso">
      <iframe
        src={embedUrl}
        title={title || "Video"}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
