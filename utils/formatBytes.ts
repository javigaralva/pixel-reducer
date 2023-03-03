export function formatBytes(bytes: number) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB'
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB'
    return (bytes / 1073741824).toFixed(2) + ' GB'
}
