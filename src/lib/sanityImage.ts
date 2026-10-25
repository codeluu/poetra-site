import { createImageUrlBuilder, type SanityImageObject } from '@sanity/image-url';
import { sanityClient } from './sanity';

type ImageCrop = { top: number; bottom: number; left: number; right: number };
type ImageHotspot = { x: number; y: number; width: number; height: number };

export type SanityImageSource = {
  crop?: ImageCrop;
  hotspot?: ImageHotspot;
  asset?: { _id?: string; _ref?: string; url?: string };
};

/** Create a cropped list preview that honors the crop and focal point saved in Studio. */
export function writingThumbnailUrl(image?: SanityImageSource) {
  if (!image?.asset) return undefined;

  return createImageUrlBuilder(sanityClient)
    .image({ ...image, _type: 'image' } as SanityImageObject)
    .width(1200)
    .height(440)
    .fit('crop')
    .auto('format')
    .url();
}
