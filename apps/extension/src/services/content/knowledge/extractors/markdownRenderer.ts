export function elementToMarkdown(el: Element): string {
  const tag = el.tagName.toUpperCase();
  switch (tag) {
    case 'H1': case 'H2': case 'H3': case 'H4': case 'H5': case 'H6': {
      const level = Number(tag[1]);
      return `${'#'.repeat(level)} ${textFrom(el)}`;
    }
    case 'P':
      return textFrom(el);
    case 'PRE': {
      const code = el.querySelector('code')?.textContent?.trim() ?? el.textContent?.trim() ?? '';
      return `\`\`\`\n${escapeCodeFence(code)}\n\`\`\``;
    }
    case 'BLOCKQUOTE': {
      const quote = cleanTextContent(el.textContent ?? '');
      return quote ? `> ${quote}` : '';
    }
    case 'UL': case 'OL': {
      const isOrdered = tag === 'OL';
      const items = Array.from(el.children).filter(c => c.tagName === 'LI');
      return items.map((li, i) => {
        const prefix = isOrdered ? `${i + 1}. ` : '- ';
        return `${prefix}${textFrom(li as HTMLElement)}`;
      }).join('\n');
    }
    case 'LI':
      return `- ${textFrom(el as HTMLElement)}`;
    case 'TABLE': {
      const rows = Array.from(el.querySelectorAll('tr'));
      const markdownRows = rows.map(row => {
        const cells = Array.from(row.children).map(c => cleanTextContent(c.textContent ?? ''));
        return `| ${cells.join(' | ')} |`;
      });
      if (markdownRows.length > 1) {
        const headerSep = markdownRows[0].replace(/[^|]/g, '-');
        markdownRows.splice(1, 0, headerSep);
      }
      return markdownRows.join('\n');
    }
    case 'IMG':
      return imageMarkdownFrom(el as HTMLImageElement) ?? '';
    case 'A': {
      const href = (el as HTMLAnchorElement).href;
      const text = textFrom(el);
      return `[${text}](${href})`;
    }
    case 'INPUT': {
      const input = el as HTMLInputElement;
      if (input.type === 'checkbox') {
        const label = textFrom(input.closest('label') ?? input.parentElement ?? input);
        return `- [${input.checked ? 'x' : ' '}] ${label}`.trim();
      }
      return '';
    }
    default:
      return cleanTextContent(el.textContent ?? '');
  }
}
 
import { cleanTextContent, textFrom, escapeCodeFence, imageMarkdownFrom } from '../utils/dom';
