export function isValidUrl(urlString: string): boolean {
    try {
        const url = new URL(urlString)
        return url.protocol === 'http:' || url.protocol === 'https:'
    } catch (_e) {
        return false
    }
}
