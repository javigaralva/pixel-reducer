import { useContext, useEffect, useState } from 'preact/hooks'
import { AppState } from '../context/AppContext.ts'
import { DownloadIcon } from '/components/icons/DownloadIcon.tsx'
import { type ImageProcessed } from '/types.d.ts'
import { formatBytes } from '/utils/formatBytes.ts'
import { useDownloadOptimizedImagesAsZip } from '/hooks/useDownloadOptimizedImagesAsZip.ts'
import { useDownloadOptimizedImage } from '/hooks/useDownloadOptimizedImage.ts'
import { Brand } from '/components/Brand.tsx'
import { InputUrlForm } from '../components/InputUrlForm.tsx'

function App() {
    const [isLoading, setIsLoading] = useState(false)
    return (
        <div className='App'>
            <header className='header'>
                <Brand />
                <InputUrlForm onIsLoading={setIsLoading} />
            </header>
            {isLoading ? <div className='loader'></div> : <OptimizedResults />}
        </div>
    )
}

function OptimizedResults() {
    const appState = useContext(AppState)
    const response = appState.optimizedImagesResponse.value

    return (
        <>
            <ResultsBrief />
            {(response?.imagesOptimized.length ?? 0) > 0
                ? (
                    <section className='results'>
                        <section className='cards-image-container'>
                            {response?.imagesOptimized.map((entry) => <CardImage entry={entry} />)}
                        </section>
                        {/* <pre style={{ textAlign: 'initial' }}>{JSON.stringify(response, null, 2)}</pre> */}
                    </section>
                )
                : null}
        </>
    )
}

function ResultsBrief() {
    const appState = useContext(AppState)
    const {
        isLoading: isLoadingDownloadSelected,
        startDownloadZip: startDownloadSelected,
    } = useDownloadOptimizedImagesAsZip()

    const response = appState.optimizedImagesResponse.value
    if (!response) return null

    const imagesSelected = appState.imagesSelected.value
    const totalImagesSelected = imagesSelected.length

    const imagesProcessedSelected = appState.imagesProcessedSelected.value

    const originalSizeSelected = imagesProcessedSelected.reduce((acc, entry) => acc + entry.size, 0)
    const optimizedSizeSelected = imagesProcessedSelected.reduce((acc, entry) => acc + entry.optimizedSize, 0)
    const totalBytesSelectedSaved = originalSizeSelected - optimizedSizeSelected
    const totalPercentageSelectedSaved = imagesProcessedSelected.length
        ? totalBytesSelectedSaved * 100 / originalSizeSelected
        : 0

    const handleDownloadSelected = () => {
        startDownloadSelected(appState.imagesProcessedSelected.value)
    }

    return (
        <section className='results__brief'>
            <div className='results__brief__stats'>
                <p>URL processed: {response.urlProcessed}</p>
                <p>Description: {response.urlDescription}</p>
                <p>
                    Found {response.imagesNotOptimized.length} images already optimized.{' '}
                    {response.imagesNotOptimized.length > 0 ? 'Well done!' : null}
                </p>
                <p>Found {response.imagesOptimized.length} optimizable images:</p>
                <div>
                    <span>{formatBytes(response.totalBytes)}</span>
                    &nbsp;→&nbsp;
                    <span>{formatBytes(response.totalBytesOptimized)}</span>
                </div>
                <p>
                    Download all optimizable images and save: {formatBytes(response.totalBytesSaved)}{' '}
                    ({response.totalPercentageSaved.toFixed(2)})%
                </p>
            </div>
            <div className='results__brief__user_selection'>
                <p>Images selected: {totalImagesSelected}</p>
                <div>
                    <span>{formatBytes(originalSizeSelected)}</span>
                    &nbsp;→&nbsp;
                    <span>{formatBytes(optimizedSizeSelected)}</span>
                </div>
                <button
                    onClick={handleDownloadSelected}
                    disabled={totalImagesSelected === 0 || isLoadingDownloadSelected}
                >
                    {isLoadingDownloadSelected
                        ? 'Downloading...'
                        : `Download all selected images and save: ${formatBytes(totalBytesSelectedSaved)} (${
                            totalPercentageSelectedSaved.toFixed(2)
                        })%`}
                </button>
                {/* <p>Download all selected images and save: {formatBytes(totalBytesSelectedSaved)} ({totalPercentageSelectedSaved.toFixed(2)})%</p> */}
            </div>
        </section>
    )
}

function CardImage(
    { entry }: { entry: ImageProcessed },
) {
    const appState = useContext(AppState)
    const { startDownload } = useDownloadOptimizedImage()

    const handleDownload = () => {
        startDownload(entry)
    }

    const handleCardSelection = () => {
        appState.onCardSelection(entry.url)
    }

    const isSelected = appState.imagesSelected.value.includes(entry.url)

    return (
        <article className={`card_image ${isSelected ? 'selected' : ''}`} key={entry.url}>
            <header>
                <img
                    className='card_image__img'
                    loading='lazy'
                    onClick={handleCardSelection}
                    src={entry.thumbnailUrl}
                />
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
