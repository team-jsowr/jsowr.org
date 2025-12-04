import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, MapPin } from 'lucide-react';
import type { SiteSettings } from '@/types/contentful';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-primary-yellow mb-4">About {settings.siteName}</h3>
            <p className="text-gray-300 text-sm">
              {settings.siteDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-primary-yellow mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about-us" className="text-gray-300 hover:text-primary-yellow transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-primary-yellow transition-colors text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-gray-300 hover:text-primary-yellow transition-colors text-sm">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-gray-300 hover:text-primary-yellow transition-colors text-sm">
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-primary-yellow mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300 text-sm">
                <Mail size={16} className="mr-2" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-primary-yellow transition-colors">
                  {settings.contactEmail}
                </a>
              </li>
              <li className="flex items-start text-gray-300 text-sm">
                <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold text-primary-yellow mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {settings.socialMediaLinks?.facebook && (
                <a
                  href={settings.socialMediaLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-primary-yellow transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={24} />
                </a>
              )}
              {settings.socialMediaLinks?.twitter && (
                <a
                  href={settings.socialMediaLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-primary-yellow transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={24} />
                </a>
              )}
              {settings.socialMediaLinks?.instagram && (
                <a
                  href={settings.socialMediaLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-primary-yellow transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={24} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
