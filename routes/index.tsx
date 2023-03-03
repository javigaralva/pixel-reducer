import { asset, Head } from '$fresh/runtime.ts'
import App from '../islands/App.tsx'

export default function Home() {
    return (
        <>
            <Head>
                <title>Fresh App</title>
                <link rel='preconnect' href='https://fonts.googleapis.com' />
                <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin />
                <link
                    href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap'
                    rel='stylesheet'
                />
                <link rel='stylesheet' href={asset('style.css')} />
            </Head>
            <body>
                <App />
            </body>
        </>
    )
}
