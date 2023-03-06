import { useContext } from 'preact/hooks'
import { AppState } from '../context/AppContext.ts'
import { formatBytes } from '/utils/formatBytes.ts'
import { useDownloadOptimizedImagesAsZip } from '/hooks/useDownloadOptimizedImagesAsZip.ts'
import { DownloadIcon } from './icons/DownloadIcon.tsx'

export function ResultsBrief() {
    const appState = useContext(AppState)
    const {
        isLoading: isLoadingDownloadSelected,
        startDownloadZip: startDownloadSelected,
    } = useDownloadOptimizedImagesAsZip()
    const {
        isLoading: isLoadingDownloadAll,
        startDownloadZip: startDownloadAll,
    } = useDownloadOptimizedImagesAsZip()

    const response = appState.optimizedImagesResponse.value
    if (!response) {
        return null
    }

    const imagesSelected = appState.imagesSelected.value
    const totalImagesSelected = imagesSelected.length

    const imagesProcessedSelected = appState.imagesProcessedSelected.value

    const originalSizeSelected = imagesProcessedSelected.reduce((acc, entry) => acc + entry.size, 0)
    const optimizedSizeSelected = imagesProcessedSelected.reduce((acc, entry) => acc + entry.optimizedSize, 0)

    const totalImagesFound = response.imagesNotOptimized.length + response.imagesOptimized.length
    const totalBytesSelectedSaved = originalSizeSelected - optimizedSizeSelected
    const totalPercentageSelectedSaved = imagesProcessedSelected.length
        ? totalBytesSelectedSaved * 100 / originalSizeSelected
        : 0

    const hasAllImagesAlreadyOptimized = totalImagesFound > 0 && response.imagesOptimized.length === 0
    const hasImagesOptimized = totalImagesFound > 0 && response.imagesOptimized.length > 0

    const handleDownloadSelected = () => {
        startDownloadSelected(appState.imagesProcessedSelected.value)
    }

    const handleDownloadAll = () => {
        startDownloadAll(appState.optimizedImagesResponse.value?.imagesOptimized)
    }

    return (
        <section className='results__brief'>
            <header className='results__brief__header'>
                <p className='results__brief__url ellipsis'>{response.urlProcessed}</p>
                <p className='results__brief__description'>{response.urlDescription}</p>
                {totalImagesFound === 0 &&
                    <p className='results__brief__no_images_found'>No images found.</p>}
                {hasAllImagesAlreadyOptimized &&
                    (
                        <p className='results__brief__no_images_found'>
                            Found {totalImagesFound} images{' '}
                            <span className='results__brief__already_optimized'>already optimized</span>. Well done!
                        </p>
                    )}
            </header>
            <section className='results__brief__stats'>
                {hasImagesOptimized && (
                    <>
                        <div className='results_brief_total_stats'>
                            <p className='results__brief__total_stats_header'>
                                Found {totalImagesFound} images
                            </p>
                            {response.imagesNotOptimized.length > 0 &&
                                (
                                    <p className='results__brief__total_stats_optimized'>
                                        {response.imagesNotOptimized.length} images are already optimized. Well done!
                                    </p>
                                )}
                            {response.imagesOptimized.length > 0 &&
                                (
                                    <>
                                        <p className='results__brief__total_stats_not_optimized'>
                                            Found {response.imagesOptimized.length} optimizable images:
                                        </p>
                                        <div className='results__brief__comparison_size'>
                                            <span>{formatBytes(response.totalBytes)}</span>
                                            &nbsp;→&nbsp;
                                            <span className='results__brief__total_bytes_optimized'>
                                                {formatBytes(response.totalBytesOptimized)}
                                            </span>
                                        </div>
                                    </>
                                )}
                        </div>

                        <div className='results__brief__user_selection'>
                            <p className='results__brief__total_stats_header'>
                                {totalImagesSelected}/{response.imagesOptimized.length}{' '}
                                image{totalImagesSelected === 1 ? '' : 's'} selected
                            </p>
                            {totalImagesSelected === 0 &&
                                (
                                    <p className='results__brief__total_stats_optimized'>
                                        Click on the image to select the images you want to optimize.
                                    </p>
                                )}

                            {totalImagesSelected > 0 &&
                                (
                                    <div className='results__brief__comparison_size'>
                                        <span>{formatBytes(originalSizeSelected)}</span>
                                        &nbsp;→&nbsp;
                                        <span className='results__brief__total_bytes_optimized'>
                                            {formatBytes(optimizedSizeSelected)}
                                        </span>
                                    </div>
                                )}
                        </div>
                        {hasImagesOptimized && (
                            <>
                                <button
                                    className='card_image__stats_saved downloadable'
                                    onClick={handleDownloadAll}
                                    disabled={isLoadingDownloadAll}
                                >
                                    <div className='card_image__stats_saved_text'>
                                        <span className='card_image__download_text'>
                                            {isLoadingDownloadAll ? 'Downloading...' : 'Download all'}
                                        </span>
                                        <span className='card_image__stats_saved_percentage'>
                                            {response.totalPercentageSaved.toFixed(2)}%
                                        </span>
                                        <span className='card_image__stats_saved_bytes'>
                                            {formatBytes(response.totalBytesSaved)} saved!
                                        </span>
                                    </div>
                                    <div className='card_image__stats_download_icon'>
                                        <DownloadIcon />
                                    </div>
                                </button>
                                {totalImagesSelected > 0 &&
                                    (
                                        <button
                                            className='card_image__stats_saved downloadable'
                                            onClick={handleDownloadSelected}
                                            disabled={totalImagesSelected === 0 || isLoadingDownloadSelected}
                                        >
                                            <div className='card_image__stats_saved_text'>
                                                <span className='card_image__download_text'>
                                                    {isLoadingDownloadSelected ? 'Downloading...' : 'Download selected'}
                                                </span>
                                                <span className='card_image__stats_saved_percentage'>
                                                    {totalPercentageSelectedSaved.toFixed(2)}%
                                                </span>
                                                <span className='card_image__stats_saved_bytes'>
                                                    {formatBytes(totalBytesSelectedSaved)} saved!
                                                </span>
                                            </div>
                                            <div className='card_image__stats_download_icon'>
                                                <DownloadIcon />
                                            </div>
                                        </button>
                                    )}
                            </>
                        )}
                    </>
                )}
            </section>
        </section>
    )
}
