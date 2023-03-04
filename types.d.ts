export interface ImageProcessed {
    fileNameExt: string
    fileName: string
    extension: string
    url: string
    size: number
    contentType: string
    width: number
    height: number
    thumbnailUrl: string
    optimizedUrl: string
    optimizedSize: number
    bytesSaved: number
    percentageSaved: number
}

export interface OptimizedImagesResponse {
    msProcessTime: number
    totalBytes: number
    totalBytesOptimized: number
    totalBytesSaved: number
    totalPercentageSaved: number
    imagesOptimized: ImageProcessed[]
    imagesNotOptimized: ImageProcessed[]
}
