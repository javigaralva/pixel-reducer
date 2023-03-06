import { useEffect, useState } from 'preact/hooks'
import { Brand } from '/components/Brand.tsx'
import { InputUrlForm } from '../components/InputUrlForm.tsx'
import { Loader } from '/components/Loader.tsx'
import { OptimizedResults } from '/components/OptimizedResults.tsx'

function App() {
    const [isLoading, setIsLoading] = useState(false)
    return (
        <div className='App'>
            <header className='header'>
                <Brand />
                <InputUrlForm onIsLoading={setIsLoading} />
            </header>
            {isLoading ? <Loader /> : <OptimizedResults />}
        </div>
    )
}

export default App
