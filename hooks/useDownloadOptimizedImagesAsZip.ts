import { useState } from 'preact/hooks'
import { type ImageProcessed } from '/types.d.ts'
import { API_ZIP_URL } from '/consts.ts'

export function useDownloadOptimizedImagesAsZip() {
    const [isLoading, setIsLoading] = useState(false)

    const startDownloadZip = (imagesProcessedSelected: ImageProcessed[] = []) => {
        if (isLoading) return
        if (!imagesProcessedSelected.length) return

        setIsLoading(true)
        fetch(API_ZIP_URL, {
            method: 'POST',
            body: JSON.stringify({
                urls: imagesProcessedSelected.map((entry: {
                    url: string
                    optimizedUrl: string
                }) => entry.optimizedUrl),
            }),
        })
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/zip' }))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `optimized-images-${Date.now()}.zip`)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return {
        isLoading,
        startDownloadZip,
    }
}
