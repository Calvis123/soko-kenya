const ALLOWED_IMAGE_HOSTS = new Set([
  "images.unsplash.com",
  "images.pexels.com",
  "res.cloudinary.com",
]);

export const FALLBACK_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80";

export const FALLBACK_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80";

export function getSafeImageUrl(
  image: string | null | undefined,
  fallback = FALLBACK_PRODUCT_IMAGE,
) {
  if (!image) {
    return fallback;
  }

  try {
    const url = new URL(image);

    if (url.protocol !== "https:" || !ALLOWED_IMAGE_HOSTS.has(url.hostname)) {
      return fallback;
    }

    return image;
  } catch {
    return fallback;
  }
}

export function getSafeImageUrls(
  images: string[] | null | undefined,
  fallback = FALLBACK_PRODUCT_IMAGE,
) {
  const safeImages = (images ?? [])
    .map((image) => getSafeImageUrl(image, fallback))
    .filter(Boolean);

  return safeImages.length > 0 ? safeImages : [fallback];
}
