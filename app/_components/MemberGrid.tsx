import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import type { TeamMember } from '@/types/contentful';

interface MemberGridProps {
  members: TeamMember[];
  emptyMessage: string;
  /** Overrides every member's own `role` field with this text - for pages (like Board of
   * Directors) where the displayed title is uniform regardless of a person's role elsewhere. */
  roleLabel?: string;
}

export default function MemberGrid({ members, emptyMessage, roleLabel }: MemberGridProps) {
  if (members.length === 0) {
    return <p className="text-center text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {members.map((member, index) => {
        const photo = member.photo?.fields;
        return (
          <div
            key={`${member.name}-${index}`}
            className="text-center p-6 bg-secondary rounded-lg shadow-sm border-t-[3px] border-t-primary-yellow"
          >
            <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
              {photo?.file ? (
                <Image
                  src={`https:${photo.file.url}`}
                  alt={(photo.title as unknown as string) || member.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-red text-white text-3xl font-bold">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
            <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
            <p className="text-primary-red font-medium mb-3">{roleLabel || member.role}</p>
            {member.bio && <p className="text-muted-foreground text-sm mb-3">{member.bio}</p>}
            <div className="flex justify-center gap-4 text-muted-foreground text-sm">
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
  );
}
