import { cheerio } from 'https://deno.land/x/denocheerio@1.0.0/mod.ts'

export async function getImagesUrls({ url }: { url: string }) {
    const rawHtml = await fetch(url).then((response) => response.text())
    const $ = cheerio.load(rawHtml)
    const imagesUrls = [
        ...$('img').map((_i, e) => {
            const src = $(e).attr('src') ?? ''
            return src ? new URL(src, url).toJSON() : ''
        }),
    ]
    return [...new Set(imagesUrls)].filter(Boolean)
}
