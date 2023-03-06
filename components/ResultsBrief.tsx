import { useContext } from 'preact/hooks'
import { AppState } from '../context/AppContext.ts'
import { formatBytes } from '/utils/formatBytes.ts'
import { useDownloadOptimizedImagesAsZip } from '/hooks/useDownloadOptimizedImagesAsZip.ts'

export function ResultsBrief() {
    const appState = useContext(AppState)
    const {
        isLoading: isLoadingDownloadSelected,
        startDownloadZip: startDownloadSelected,
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
