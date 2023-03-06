import { createContext } from 'preact'
import { computed, type ReadonlySignal, type Signal, signal } from '@preact/signals'
import { ImageProcessed, OptimizedImagesResponse } from '/types.d.ts'

type SetOptimizedImagesResponse = (optimizedImagesResponse: OptimizedImagesResponse | null) => void
type OnCardSelection = (url: string) => void

interface AppStateInterface {
    optimizedImagesResponse: ReadonlySignal<OptimizedImagesResponse | null>
    imagesSelected: Signal<string[]>
    imagesProcessedSelected: ReadonlySignal<(ImageProcessed)[]>
    setOptimizedImagesResponse: SetOptimizedImagesResponse
    onCardSelection: OnCardSelection
}

export function createAppState(): AppStateInterface {
    const imagesSelected = signal<string[]>([])
    const optimizedImagesResponse = signal<OptimizedImagesResponse | null>(null)

    const onCardSelection: OnCardSelection = (url) => {
        const isSelected = imagesSelected.value.includes(url)
        imagesSelected.value = isSelected
            ? imagesSelected.value.filter((_url) => _url !== url) // remove selection
            : [...imagesSelected.value, url] // add selection
    }

    const imagesProcessedSelected = computed(() => {
        if (optimizedImagesResponse.value === null) return []
        return imagesSelected.value.map((urlSelected) =>
            optimizedImagesResponse.value!.imagesOptimized.find(({ url }) => url === urlSelected)!
        )
    })

    const setOptimizedImagesResponse: SetOptimizedImagesResponse = (response) => {
        imagesSelected.value = []
        optimizedImagesResponse.value = response
    }

    return {
        imagesSelected,
        imagesProcessedSelected,
        optimizedImagesResponse,
        onCardSelection,
        setOptimizedImagesResponse,
    }
}

export const AppState = createContext<AppStateInterface>(createAppState())
