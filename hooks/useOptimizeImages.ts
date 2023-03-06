import { useEffect, useState } from 'preact/hooks'
import { API_OPTIMIZE_URL } from '/consts.ts'
import { type OptimizedImagesResponse } from '/types.d.ts'

export function useOptimizeImages() {
    const [url, setUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [optimizedImagesResponse, setOptimizedImagesResponse] = useState<OptimizedImagesResponse | null>(null)

    useEffect(() => {
        if (!url) return
        const urlToFetch = `${API_OPTIMIZE_URL}/${encodeURIComponent(url)}`
        setIsLoading(true)
        fetch(urlToFetch)
            .then((response) => response.json())
            .then((json: OptimizedImagesResponse) => {
                setOptimizedImagesResponse(json)
            })
            .catch((_error) => {
                setIsLoading(false)
                setOptimizedImagesResponse(null)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [url])

    return {
        isLoading,
        optimizedImagesResponse,
        optimizeImagesFrom: setUrl,
    }
}
