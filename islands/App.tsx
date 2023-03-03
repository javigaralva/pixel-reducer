import { useState } from 'preact/hooks'
import { type Entry, type OptimizeResponse } from '/types.d.ts'
import { formatBytes } from '/utils/formatBytes.ts'
import { isValidUrl } from '/utils/isValidUrl.ts'

const API_BASE_URL = ''
const API_OPTIMIZE_URL = `${API_BASE_URL}/api/optimize`
const API_ZIP_URL = `${API_BASE_URL}/api/zip`

function App() {
    const [urlInput, setUrlInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState<OptimizeResponse | null>(null)

    const handleOptimizeImages = () => {
        if (!urlInput) return
        const url = `${API_OPTIMIZE_URL}/${encodeURIComponent(urlInput)}`
        setIsLoading(true)
        fetch(url)
            .then((response) => response.json())
            .then((json: OptimizeResponse) => {
                setResponse(json)
            })
            .catch((response) => {
                setIsLoading(false)
                setResponse(null)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleDownload = () => {
        const responseObj = response
        if (!responseObj?.entriesToBeOptimized?.length) return

        setIsLoading(true)
        fetch(API_ZIP_URL, {
            method: 'POST',
            body: JSON.stringify({
                urls: responseObj.entriesToBeOptimized.map((entry: {
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
                link.setAttribute('download', 'file.zip')
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const isValidUrlInput = isValidUrl(urlInput)

    return (
        <div className='App'>
            URL:{' '}
            <input
                value={urlInput}
                type={'text'}
                size={60}
                disabled={isLoading}
                onInput={(e) => setUrlInput(e.currentTarget.value)}
            />
            <div>
                <button onClick={handleOptimizeImages} disabled={isLoading || !isValidUrlInput}>Analyze!</button>
                {!isLoading &&
                    response &&
                    response.entriesToBeOptimized.length > 0 &&
                    (
                        <button onClick={handleDownload} disabled={isLoading}>
                            Download All and save {formatBytes(response.totalBytesSaved)}!
                        </button>
                    )}
            </div>
            {isLoading
                ? <p>Loading...</p>
                : ((response?.entriesToBeOptimized.length ?? 0) > 0
                    ? (
                        <section className='results'>
                            <div className='cards-image-container'>
                                {response?.entriesToBeOptimized.map((entry) => <CardImage entry={entry} />)}
                            </div>
                            <pre style={{ textAlign: 'initial' }}>{JSON.stringify(response, null, 2)}</pre>
                        </section>
                    )
                    : null)}
        </div>
    )
}

function CardImage({ entry }: { entry: Entry }) {
    return (
        <article className='card_image' key={entry.url}>
            <header>
                <img className='card_image__img' loading='lazy' src={entry.thumbnailUrl} />
            </header>
            <footer>
                <div className='card_image__filename_and_dimensions'>
                    <div className='card_image__dimensions'>{entry.height}&nbsp;×&nbsp;{entry.width}</div>
                    <div className='card_image__filename ellipsis' alt={entry.fileName}>{entry.fileName}</div>
                </div>
                <div className='card_image__stats'>
                    <div className='card_image__stats_size'>
                        <a href={entry.url} target='_blank'>{formatBytes(entry.size)}</a>
                        &nbsp;→&nbsp;
                        <a href={entry.optimizedUrl} target='_blank'>{formatBytes(entry.optimizedSize)}</a>
                    </div>
                    <div className='card_image__stats_saved'>
                        <span className='card_image__stats_saved_percentage'>{entry.percentageSaved.toFixed(2)}%</span>
                        <span className='card_image__stats_saved_bytes'>{formatBytes(entry.bytesSaved)} saved!</span>
                    </div>
                </div>
            </footer>
        </article>
    )
}

export default App
