import { asset, Head } from '$fresh/runtime.ts'
import { AppState, createAppState } from '/context/AppContext.ts'
import App from '/islands/App.tsx'

export default function Home() {
    return (
        <>
            <Head>
                <title>Pixel Reducer</title>
                <link rel='preconnect' href='https://fonts.googleapis.com' />
                <link rel='preconnect' href='https://fonts.gstatic.com' />
                <link
                    href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap'
                    rel='stylesheet'
                />
                <link rel='stylesheet' href={asset('style.css')} />
                <meta name='description' content='Pixel Reducer: Optimizes the size of images on a website' />
            </Head>
            <body>
                <AppState.Provider value={createAppState()}>
                    <App />
                </AppState.Provider>
            </body>
        </>
    )
}
