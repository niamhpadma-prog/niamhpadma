import { createBrowserClient } from "@supabase/ssr";

// Supabase client for the browser, signed in as the current user. Used for
// uploads, which go straight to storage rather than through the site.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
