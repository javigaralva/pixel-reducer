import { useEffect, useState } from 'preact/hooks'
import { DownloadIcon } from '/components/icons/DownloadIcon.tsx'
import { type ImageProcessed, type OptimizedImagesResponse } from '/types.d.ts'
import { formatBytes } from '/utils/formatBytes.ts'
import { isValidUrl } from '/utils/isValidUrl.ts'

const API_BASE_URL = ''
const API_OPTIMIZE_URL = `${API_BASE_URL}/api/optimize`
const API_ZIP_URL = `${API_BASE_URL}/api/zip`

function App() {
    const [isFirstRender, setIsFirstRender] = useState(true)
    const [urlInput, setUrlInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState<OptimizedImagesResponse | null>(null)
    const [imagesSelected, setImagesSelected] = useState<string[]>([])

    useEffect(() => {
        setIsFirstRender(false)
    }, [])

    const handleOptimizeImages = () => {
        if (!urlInput) return
        const url = `${API_OPTIMIZE_URL}/${encodeURIComponent(urlInput)}`
        setIsLoading(true)
        fetch(url)
            .then((response) => response.json())
            .then((json: OptimizedImagesResponse) => {
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

    const handleDownloadAll = () => {
        const responseObj = response
        if (!responseObj?.imagesOptimized?.length) return

        setIsLoading(true)
        fetch(API_ZIP_URL, {
            method: 'POST',
            body: JSON.stringify({
                urls: responseObj.imagesOptimized.map((entry: {
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

    const handleCardSelection = (url: string) => {
        setImagesSelected((prevState) => {
            const isSelected = imagesSelected.includes(url)
            return isSelected ? prevState.filter((_url) => _url !== url) : [...prevState, url]
        })
    }

    const isValidUrlInput = isValidUrl(urlInput)
    const initialStateClass = isFirstRender ? 'initial_state' : ''

    return (
        (
            <div className='App'>
                <header className='header'>
                    <section className='brand'>
                        <h1 className='brand__title'>
                            <span className={`brand__title_pixel ${initialStateClass}`}>Pixel</span>
                            <br />
                            <span className={`brand__title_reducer ${initialStateClass}`}>Reducer</span>
                        </h1>
                        <h2 className='brand__subtitle'>
                            <span className={`brand__subtitle_optimize ${initialStateClass}`}>Optimizes</span>{' '}
                            the size of images on a website.
                        </h2>
                        <p className='brand__description'>
                            Download all images with one click. Commitment to quality with zero setup.
                        </p>
                    </section>
                    <form
                        className='form_input'
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleOptimizeImages()
                        }}
                    >
                        <label className='form_input__label_input'>
                            URL
                            <input
                                className='form_input__input'
                                value={urlInput}
                                type={'url'}
                                pattern='https?://.+'
                                disabled={isLoading}
                                placeholder={'https://midu.dev'}
                                required
                                onInput={(e) => setUrlInput(e.currentTarget.value)}
                            />
                        </label>
                        <div>
                            <button onClick={handleOptimizeImages} disabled={isLoading || !isValidUrlInput}>
                                Analyze!
                            </button>
                            {!isLoading &&
                                response &&
                                response.imagesOptimized.length > 0 &&
                                (
                                    <button onClick={handleDownloadAll} disabled={isLoading}>
                                        Download All and save {formatBytes(response.totalBytesSaved)}!
                                    </button>
                                )}
                        </div>
                    </form>
                </header>
                {isLoading
                    ? <div className='loader'></div>
                    : ((response?.imagesOptimized.length ?? 0) > 0
                        ? (
                            <section className='results'>
                                <div className='cards-image-container'>
                                    {response?.imagesOptimized.map((entry) => (
                                        <CardImage
                                            entry={entry}
                                            isSelected={imagesSelected.includes(entry.url)}
                                            onSelection={() => handleCardSelection(entry.url)}
                                        />
                                    ))}
                                </div>
                                {/* <pre style={{ textAlign: 'initial' }}>{JSON.stringify(response, null, 2)}</pre> */}
                            </section>
                        )
                        : null)}
            </div>
        )
    )
}

function CardImage(
    { entry, isSelected, onSelection }: { entry: ImageProcessed; isSelected: boolean; onSelection: () => void },
) {
    const handleDownload = () => {
        fetch(entry.optimizedUrl).then((response) => {
            response.blob().then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', entry.fileNameExt)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            })
        })
    }

    return (
        <article className={`card_image ${isSelected ? 'selected' : ''}`} key={entry.url}>
            <header>
                <img className='card_image__img' loading='lazy' onClick={onSelection} src={entry.thumbnailUrl} />
            </header>
            <footer>
                <section className='card_image__file_info'>
                    <div className='card_image__filetype_and_dimensions'>
                        <div className='card_image__dimensions'>{entry.height}&nbsp;×&nbsp;{entry.width}</div>
                        <ImageType extension={entry.extension} />
                    </div>
                    <div className='card_image__filename ellipsis' alt={entry.fileName}>{entry.fileName}</div>
                </section>
                <section className='card_image__stats'>
                    <div className='card_image__stats_saved downloadable' onClick={handleDownload}>
                        <div className='card_image__stats_saved_text'>
                            <span className='card_image__stats_saved_percentage'>
                                {entry.percentageSaved.toFixed(2)}%
                            </span>
                            <span className='card_image__stats_saved_bytes'>
                                {formatBytes(entry.bytesSaved)} saved!
                            </span>
                        </div>
                        <div className='card_image__stats_download_icon'>
                            <DownloadIcon />
                        </div>
                    </div>
                    <div className='card_image__stats_size'>
                        <a href={entry.url} target='_blank'>{formatBytes(entry.size)}</a>
                        &nbsp;→&nbsp;
                        <a href={entry.optimizedUrl} target='_blank'>{formatBytes(entry.optimizedSize)}</a>
                    </div>
                </section>
            </footer>
        </article>
    )
}

function ImageType({ extension }: { extension: string }) {
    const extensionModifierCss = extension.toLowerCase().replace('.', '')
    return <div className={`card_image__type card_image__type--${extensionModifierCss}`}>{extensionModifierCss}</div>
}

export default App
