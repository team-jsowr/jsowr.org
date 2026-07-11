import { Metadata } from 'next';
import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import { getTeamMembers } from '@/lib/contentful-api';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Our Team | JSOWR',
  description: 'Meet the committee and leadership of the Jain Society of Waterloo Region.',
};

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <main className="py-16 bg-white min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Our Team</h1>
          <p className="text-lg text-gray-600">
            Meet the committee and leadership of the Jain Society of Waterloo Region.
          </p>
        </div>

        {members.length === 0 ? (
          <p className="text-center text-gray-500">Team information is coming soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member, index) => {
              const photo = member.photo?.fields;
              return (
                <div
                  key={`${member.name}-${index}`}
                  className="text-center p-6 bg-gray-50 rounded-lg shadow-sm"
                >
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                    {photo?.file ? (
                      <Image
                        src={`https:${photo.file.url}`}
                        alt={(photo.title as unknown as string) || member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-red text-white text-3xl font-bold">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-primary-red font-medium mb-3">{member.role}</p>
                  {member.bio && <p className="text-gray-600 text-sm mb-3">{member.bio}</p>}
                  <div className="flex justify-center gap-4 text-gray-500 text-sm">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center hover:text-primary-red transition-colors"
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail size={16} />
                      </a>
                    )}
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center hover:text-primary-red transition-colors"
                        aria-label={`Call ${member.name}`}
                      >
                        <Phone size={16} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
