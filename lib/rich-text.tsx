import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import type { Document } from '@contentful/rich-text-types';

export const richTextOptions = {
  renderNode: {
    [INLINES.HYPERLINK]: (node: any, children: any) => (
      <a
        href={node.data.uri}
        target={node.data.uri?.startsWith('http') ? '_blank' : undefined}
        rel={node.data.uri?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="text-primary-red font-medium underline decoration-primary-yellow decoration-2 underline-offset-2 hover:text-primary-yellow transition-colors"
      >
        {children}
      </a>
    ),
    [BLOCKS.PARAGRAPH]: (_node: any, children: any) => (
      <p className="mb-4 text-foreground/85 leading-relaxed">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (_node: any, children: any) => (
      <h1 className="text-4xl font-bold mb-6 text-foreground font-serif">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (_node: any, children: any) => (
      <h2 className="text-3xl font-bold mb-4 text-foreground font-serif">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (_node: any, children: any) => (
      <h3 className="text-2xl font-semibold mb-3 text-foreground font-serif">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (_node: any, children: any) => (
      <ul className="list-disc list-inside mb-4 space-y-2 marker:text-primary-yellow">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node: any, children: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 marker:text-primary-yellow marker:font-semibold">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node: any, children: any) => (
      <li className="text-foreground/85 [&>p]:mb-0 [&>p]:inline">{children}</li>
    ),
  },
};

export function renderRichText(content: Document) {
  return documentToReactComponents(content, richTextOptions);
}
