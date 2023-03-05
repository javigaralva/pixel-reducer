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

const cloudinaryProductEnvironment = Deno.env.get('CLOUDINARY_PRODUCT_ENVIRONMENT') ?? 'demo'

export const CLOUDINARY_OPTIMIZED_URL = `https://res.cloudinary.com/${cloudinaryProductEnvironment}/image/fetch/q_auto:low`
export const CLOUDINARY_THUMBNAIL_URL = `https://res.cloudinary.com/${cloudinaryProductEnvironment}/image/fetch/c_scale,c_lfill,w_200,q_auto:low`
