export interface Entry {
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

export interface OptimizeResponse {
    msProcessTime: number
    totalBytes: number
    totalBytesOptimized: number
    totalBytesSaved: number
    totalPercentageSaved: number
    entriesToBeOptimized: Entry[]
    entriesCannotBeOptimized: Entry[]
}
