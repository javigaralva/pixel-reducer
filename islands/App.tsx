import { useContext, useEffect, useRef, useState } from 'preact/hooks'
import { Brand } from '/components/Brand.tsx'
import { InputUrlForm } from '../components/InputUrlForm.tsx'
import { Loader } from '/components/Loader.tsx'
import { OptimizedResults } from '/components/OptimizedResults.tsx'
import { AppState } from '/context/AppContext.ts'
import { DownloadIcon } from '/components/icons/DownloadIcon.tsx'

function App() {
    const appState = useContext(AppState)
    const [isLoading, setIsLoading] = useState(false)
    const optimizedResultsRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (optimizedResultsRef.current) {
            optimizedResultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [isLoading])

    const handleGoUp = () => {
        if (optimizedResultsRef.current) {
            optimizedResultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const hasToShowGoUp = !isLoading && appState.imagesSelected.value.length > 0 &&
        Number(appState.optimizedImagesResponse.value?.imagesOptimized.length) > 0

    return (
        (
            <div className='App'>
                <div className={`go_up ${hasToShowGoUp ? 'visible' : ''}`} onClick={handleGoUp}>
                    <DownloadIcon />
                </div>
                <header className='header'>
                    <Brand />
                    <InputUrlForm onIsLoading={setIsLoading} />
                </header>
                {isLoading ? <Loader /> : (
                    <div ref={optimizedResultsRef}>
                        <OptimizedResults />
                    </div>
                )}
            </div>
        )
    )
}

export default App
