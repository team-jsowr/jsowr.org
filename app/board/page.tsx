import { Metadata } from 'next';
import { getBoardMembers } from '@/lib/contentful-api';
import MemberGrid from '@/app/_components/MemberGrid';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Board of Directors',
  description: 'Meet the Board of Directors of the Jain Society of Waterloo Region.',
};

export default async function BoardPage() {
  const members = await getBoardMembers();

  return (
    <main className="py-16 bg-background min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Board of Directors</h1>
          <p className="text-lg text-muted-foreground">
            Meet the Board of Directors of the Jain Society of Waterloo Region.
          </p>
        </div>

        <MemberGrid members={members} emptyMessage="Board information is coming soon." roleLabel="Board Member" />
      </div>
    </main>
  );
}
