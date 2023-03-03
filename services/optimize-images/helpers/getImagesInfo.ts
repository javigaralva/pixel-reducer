import { isFulfilled } from '/utils/isFulfilled.ts'
import { ImageContentType } from '../consts.ts'
import { getFileNameInfoFrom } from './getFileNameInfoFrom.ts'

type GetImagesSizeParams = {
    imagesUrl: string[]
}

export type ImageInfo = {
    url: string
    size: number
    contentType: string
    fileNameExt: string
    fileName: string
    extension: string
}

export async function getImagesInfo({ imagesUrl }: GetImagesSizeParams): Promise<ImageInfo[]> {
    const imagesSizes = await Promise.allSettled(
        imagesUrl.map(async (url) => {
            const blob = await fetch(url).then((response) => response.blob())
            const info = getFileNameInfoFrom({
                url,
                contentType: blob.type as ImageContentType,
            })
            return {
                ...info,
                url: url,
                size: blob.size,
                contentType: blob.type,
            }
        }),
    )
    return imagesSizes
        .filter(isFulfilled)
        .map((result) => result.value)
}
