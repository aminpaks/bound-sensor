export function escapeHtml(html: string): string {
  const replaceNodes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
  };
  const replaceRE = new RegExp(`[${Object.keys(replaceNodes).join('')}]`, 'g');
  return html.replace(replaceRE, (node) => replaceNodes[node] || node);
}
