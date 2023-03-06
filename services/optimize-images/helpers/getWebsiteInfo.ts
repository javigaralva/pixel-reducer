import { cheerio } from 'https://deno.land/x/denocheerio@1.0.0/mod.ts'

export async function getWebsiteInfo({ url }: { url: string }) {
    const rawHtml = await fetch(url).then((response) => response.text())
    const $ = cheerio.load(rawHtml)
    const allImagesUrls = [
        ...$('img').map((_i, e) => {
            const src = $(e).attr('src') ?? ''
            return src ? new URL(src, url).toJSON() : ''
        }),
    ]
    const imagesUrls = [...new Set(allImagesUrls)].filter(Boolean)
    const description = $('meta[name="description"]').attr('content') ?? ''
    return {
        description,
        imagesUrls,
    }
}