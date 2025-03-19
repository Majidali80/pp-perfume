import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

import { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: "i9k4wrvx",
  dataset: "production",
  useCdn: false, // Disable CDN for write operations
  apiVersion: "2025-01-13",
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN, // Ensure this is set in .env.local
});

const builder = imageUrlBuilder(client);
export const urlFor = (source: SanityImageSource) => builder.image(source);

export default client;
