function djb2(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i)
    hash = hash >>> 0
  }
  return hash
}

export function domainToColor(domain: string): string {
  const hue = djb2(domain) % 360
  return `hsl(${hue}, 75%, 60%)`
}
