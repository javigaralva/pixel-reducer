import { useContext } from 'preact/hooks'
import { AppState } from '../context/AppContext.ts'
import { CardImage } from './CardImage.tsx'
import { ResultsBrief } from './ResultsBrief.tsx'

export function OptimizedResults() {
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
                    </section>
                )
                : null}
        </>
    )
}
