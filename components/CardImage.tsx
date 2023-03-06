import { useContext } from 'preact/hooks'
import { AppState } from '../context/AppContext.ts'
import { DownloadIcon } from '/components/icons/DownloadIcon.tsx'
import { type ImageProcessed } from '/types.d.ts'
import { formatBytes } from '/utils/formatBytes.ts'
import { useDownloadOptimizedImage } from '/hooks/useDownloadOptimizedImage.ts'
import { ImageType } from './ImageType.tsx'

export function CardImage({ entry }: { entry: ImageProcessed }) {
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
