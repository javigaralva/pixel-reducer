import { useContext, useEffect, useState } from 'preact/hooks'
import { isValidUrl } from '/utils/isValidUrl.ts'
import { AppState } from '/context/AppContext.ts'
import { useOptimizeImages } from '/hooks/useOptimizeImages.ts'

export function InputUrlForm({ onIsLoading }: { onIsLoading: (isLoading: boolean) => void }) {
    const appState = useContext(AppState)
    const [urlInput, setUrlInput] = useState('')
    const {
        isLoading,
        optimizedImagesResponse,
        optimizeImagesFrom,
    } = useOptimizeImages()

    useEffect(() => {
        appState.setOptimizedImagesResponse(optimizedImagesResponse)
    }, [optimizedImagesResponse])

    useEffect(() => {
        console.log({ isLoading })
        onIsLoading(isLoading)
    }, [isLoading])

    const handleOptimizeImages = () => {
        optimizeImagesFrom(urlInput)
    }

    const isValidUrlInput = isValidUrl(urlInput)

    return (
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
                <button disabled={isLoading || !isValidUrlInput}>
                    Optimize!
                </button>
            </div>
        </form>
    )
}
