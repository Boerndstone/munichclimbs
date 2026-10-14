const mediaOrigin = process.env.NEXT_PUBLIC_MEDIA_ORIGIN ?? "https://www.munichclimbs.de"

export function headerImageUrl(image: string): string {
  return `${mediaOrigin}/uploads/header/${image}-large-@1x.webp`
}

export function topoImageUrl(image: string): string {
  if (image.startsWith("http://") || image.startsWith("https://")) return image
  const baseName = image.split("/").at(-1)?.replace(/\.(webp|png|jpe?g|avif)$/i, "") ?? image
  return `${mediaOrigin}/build/images/topos/${baseName}.webp`
}

export function galleryImageUrl(name: string): string {
  return `${mediaOrigin}/uploads/galerie/${encodeURIComponent(name)}`
}
