export const IMAGE_CONTENT_TYPES_EXTENSIONS = {
    'image/avif': '.avif',
    'image/bmp': '.bmp',
    'image/gif': '.gif',
    'image/jpe': '.jpe',
    'image/jpg': '.jpg',
    'image/jpeg': '.jpeg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/x-icon': '.ico',
}
export type ImageContentType = keyof typeof IMAGE_CONTENT_TYPES_EXTENSIONS
export const IMAGE_CONTENT_TYPES = Object.keys(IMAGE_CONTENT_TYPES_EXTENSIONS)
export const IMAGE_EXTENSIONS = Object.values(IMAGE_CONTENT_TYPES_EXTENSIONS)

const CLOUDINARY_BASE_URL = `https://res.cloudinary.com`
const CLOUDINARY_PRODUCT_ENVIRONMENT = Deno.env.get('CLOUDINARY_PRODUCT_ENVIRONMENT') ?? 'demo'
const CLOUDINARY_IMAGE_FETCH_URL = `${CLOUDINARY_BASE_URL}/${CLOUDINARY_PRODUCT_ENVIRONMENT}/image/fetch`

export const CLOUDINARY_OPTIMIZED_URL = `${CLOUDINARY_IMAGE_FETCH_URL}/q_auto:low`
export const CLOUDINARY_THUMBNAIL_URL = `${CLOUDINARY_IMAGE_FETCH_URL}/c_scale,c_lfill,w_200,q_auto:low`
