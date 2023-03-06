import { useState } from 'preact/hooks'
import { type ImageProcessed } from '/types.d.ts'

export function useDownloadOptimizedImage() {
    const [isLoading, setIsLoading] = useState(false)

    const startDownload = (entry: ImageProcessed) => {
        if (isLoading) return
        setIsLoading(true)
        fetch(entry.optimizedUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', entry.fileNameExt)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                setIsLoading(false)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    return {
        isLoading,
        startDownload,
    }
}
