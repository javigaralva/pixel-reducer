import { loadImage } from 'https://deno.land/x/canvas@v1.4.1/mod.ts'
import { type OptimizedImagesResponse } from '/types.d.ts'
import { isFulfilled } from '/utils/isFulfilled.ts'
import { CLOUDINARY_OPTIMIZED_URL, CLOUDINARY_THUMBNAIL_URL } from './consts.ts'
import { getImagesInfo, type ImageInfo } from './helpers/getImagesInfo.ts'
import { getImagesUrls } from './helpers/getImagesUrls.ts'
import { isOptimizableImage } from './helpers/isOptimizableImage.ts'

export async function optimizeStaticImagesFrom({ url }: { url: string }): Promise<OptimizedImagesResponse> {
    const tInitProcess = Date.now()

    const optimizedImages = await getOptimizedImagesFrom(url)

    const imagesOptimized = optimizedImages.filter((data) => data.optimizedSize < data.size)
    const imagesNotOptimized = optimizedImages.filter((data) => data.optimizedSize > data.size)

    imagesOptimized.sort((a, b) => b.bytesSaved - a.bytesSaved)

    const totalBytes = imagesOptimized.reduce((acc, curr) => acc + curr.size, 0)
    const totalBytesOptimized = imagesOptimized.reduce((acc, curr) => acc + curr.optimizedSize, 0)
    const totalBytesSaved = totalBytes - totalBytesOptimized
    const totalPercentageSaved = totalBytes > 0 ? totalBytesSaved * 100 / totalBytes : 0

    const msProcessTime = Date.now() - tInitProcess

    return {
        urlProcessed: url,
        msProcessTime,
        totalBytes,
        totalBytesOptimized,
        totalBytesSaved,
        totalPercentageSaved,
        imagesOptimized,
        imagesNotOptimized,
    }
}

async function getOptimizedImagesFrom(url: string) {
    try {
        const imagesUrl = await getImagesUrls({ url })
        const imagesSizes = await getImagesInfo({ imagesUrl })

        const validParsedImages = imagesSizes.filter(isOptimizable)

        const optimizedImages = await getOptimizedImages(validParsedImages)
        return optimizedImages
    } catch (_ex) {
        return []
    }
}

async function getOptimizedImages(images: ImageInfo[]) {
    return (await Promise.allSettled(images.map(optimizeImage)))
        .filter(isFulfilled)
        .map((result) => result.value)
        .map((entry) => {
            const difference = entry.size - entry.optimizedSize
            return {
                ...entry,
                bytesSaved: difference,
                percentageSaved: difference * 100 / entry.size,
            }
        })
}

function isOptimizable(result: { size: number; contentType: string }) {
    return result.size > 0 && isOptimizableImage(result.contentType)
}

async function optimizeImage(image: ImageInfo) {
    const { url } = image
    const optimizedUrl = `${CLOUDINARY_OPTIMIZED_URL}/${url}`
    const thumbnailUrl = `${CLOUDINARY_THUMBNAIL_URL}/${url}`

    const optimizedImageResponse = await fetch(optimizedUrl)
    const {
        size: optimizedSize,
        height,
        width,
    } = await getImageSizeAndDimensionsFrom(optimizedImageResponse)

    return {
        ...image,
        width,
        height,
        thumbnailUrl,
        optimizedUrl,
        optimizedSize,
    }
}

async function getImageSizeAndDimensionsFrom(response: Response) {
    const { size } = await response.clone().blob()
    const arrayBuffer = await response.arrayBuffer()
    const image = await loadImage(new Uint8Array(arrayBuffer))
    return {
        size,
        height: image.height(),
        width: image.width(),
    }
}
