export type LinkAttributes = {
  target?: '_blank';
  rel?: 'noopener noreferrer';
};

export function getLinkAttributes(openInNewTab?: boolean): LinkAttributes {
  return openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};
}

export function linkAttributesToHtml(openInNewTab?: boolean) {
  const attributes = getLinkAttributes(openInNewTab);

  return Object.entries(attributes)
    .map(([name, value]) => ` ${name}="${value}"`)
    .join('');
}
