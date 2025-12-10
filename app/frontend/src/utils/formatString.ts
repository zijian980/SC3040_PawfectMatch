export function capitalizeWords(str: string): string {
  const lowerStr = str.toLowerCase()
  return lowerStr.replace(/\b(\w)/g, (match) => match.toUpperCase())
}
