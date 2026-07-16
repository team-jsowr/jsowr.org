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
  const bgColorClass = backgroundColor === 'gray' ? 'bg-secondary' : 'bg-background';

  const layoutClass =
    layout === 'two-column' ? 'grid md:grid-cols-2 gap-8' :
    layout === 'three-column' ? 'grid md:grid-cols-3 gap-8' :
    'max-w-4xl mx-auto';

  return (
    <section className={`${bgColorClass} py-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-serif">
              {title}
            </h2>
            <div className="w-14 h-0.5 bg-primary-yellow mx-auto mt-3" />
          </div>
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
