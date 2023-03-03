import * as Path from 'https://deno.land/std@0.178.0/path/mod.ts'
import { IMAGE_CONTENT_TYPES_EXTENSIONS, ImageContentType } from '../consts.ts'
import { isValidExtension } from './isValidExtension.ts'

type GetFileNameInfoFromParams = {
    url: string
    contentType: ImageContentType
}

export function getFileNameInfoFrom({ url, contentType }: GetFileNameInfoFromParams) {
    const parsedOriginalFileName = Path.parse(url.replace(/[\?\<\>\|]/g, '_'))

    const extension = isValidExtension(parsedOriginalFileName.ext)
        ? parsedOriginalFileName.ext
        : IMAGE_CONTENT_TYPES_EXTENSIONS[contentType] ?? ''
    const fileName = parsedOriginalFileName.name

    return {
        fileNameExt: fileName + extension,
        fileName,
        extension,
    }
}
