import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import type { Document } from '@contentful/rich-text-types';

interface ContentSectionProps {
  title?: string;
  content: Document;
  backgroundColor?: string;
  layout?: 'single-column' | 'two-column' | 'three-column';
}

const renderOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node: any, children: any) => (
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (_node: any, children: any) => (
      <h1 className="text-4xl font-bold mb-6 text-gray-900">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (_node: any, children: any) => (
      <h2 className="text-3xl font-bold mb-4 text-gray-900">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (_node: any, children: any) => (
      <h3 className="text-2xl font-semibold mb-3 text-gray-900">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (_node: any, children: any) => (
      <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node: any, children: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node: any, children: any) => (
      <li className="text-gray-700">{children}</li>
    ),
  },
};

export default function ContentSection({
  title,
  content,
  backgroundColor = 'white',
  layout = 'single-column',
}: ContentSectionProps) {
  const bgColorClass = backgroundColor === 'gray' ? 'bg-gray-50' : 'bg-white';
  
  const layoutClass = 
    layout === 'two-column' ? 'grid md:grid-cols-2 gap-8' :
    layout === 'three-column' ? 'grid md:grid-cols-3 gap-8' :
    'max-w-4xl mx-auto';
  
  return (
    <section className={`${bgColorClass} py-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 text-center">
            {title}
          </h2>
        )}
        <div className={layoutClass}>
          <div className="prose prose-lg max-w-none">
            {documentToReactComponents(content, renderOptions)}
          </div>
        </div>
      </div>
    </section>
  );
}
