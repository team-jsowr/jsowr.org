import type { Document } from '@contentful/rich-text-types';
import { renderRichText } from '@/lib/rich-text';

interface ContentSectionProps {
  title?: string;
  content: Document;
  backgroundColor?: string;
  layout?: 'single-column' | 'two-column' | 'three-column';
}

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
            {renderRichText(content)}
          </div>
        </div>
      </div>
    </section>
  );
}
