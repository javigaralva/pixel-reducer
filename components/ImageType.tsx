export function ImageType({ extension }: { extension: string }) {
    const extensionModifierCss = extension.toLowerCase().replace('.', '')
    return <div className={`card_image__type card_image__type--${extensionModifierCss}`}>{extensionModifierCss}</div>
}
