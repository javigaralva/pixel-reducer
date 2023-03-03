import { IMAGE_EXTENSIONS } from '../consts.ts'

export function isValidExtension(extension: string) {
    return IMAGE_EXTENSIONS.includes(extension.toLowerCase())
}
