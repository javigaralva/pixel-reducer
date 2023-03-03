import { IMAGE_CONTENT_TYPES } from '../consts.ts'

export function isOptimizableImage(contentType: string) {
    return IMAGE_CONTENT_TYPES.includes(contentType)
}
