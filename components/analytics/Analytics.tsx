// Google Analytics (gtag.js).
//
// We render native <script> tags rather than next/script so React 19 hoists
// them into the document <head>. Google Search Console's "Google Analytics"
// ownership-verification method requires the tracking snippet to live in
// <head> — next/script (afterInteractive/beforeInteractive) only emits a
// preload hint there and runs the real script in <body>, which fails
// verification. React hoists <script async src> to <head>; we place the
// inline bootstrap immediately after so the standard snippet stays intact.
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <script
        id="ga4-init"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { page_title: document.title, send_page_view: true });`,
        }}
      />
    </>
  );
}
