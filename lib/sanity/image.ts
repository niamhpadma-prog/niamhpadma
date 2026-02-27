import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0];

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
