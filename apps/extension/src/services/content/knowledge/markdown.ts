 
export function ensureSourceLine(
  markdown: string,
  siteName: string,
  hostname: string,
): string {
  const sourceLine = `Source: ${siteName} (${hostname})`;
  if (markdown.includes(sourceLine)) {
    return markdown;
  }
  const trimmed = markdown.trimEnd();
  return trimmed ? `${trimmed}\n\n${sourceLine}\n` : `${sourceLine}\n`;
}
