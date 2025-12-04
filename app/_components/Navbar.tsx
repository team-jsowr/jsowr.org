"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import type { SiteSettings, NavigationItem } from '@/types/contentful';
import type { Entry } from 'contentful';

interface NavbarProps {
  settings: SiteSettings;
}

function parseNavItem(entry: any): NavigationItem & { id: string } {
  if (!entry || !entry.fields) {
    return {
      id: entry?.sys?.id || '',
      label: '',
      href: '',
      order: 0,
      children: undefined,
    };
  }
  
  return {
    id: entry.sys.id,
    label: entry.fields.label || '',
    href: entry.fields.href,
    order: entry.fields.order,
    children: entry.fields.children,
  };
}

function DesktopNavItem({ item, isActive }: { item: NavigationItem & { id: string }, isActive: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const pathname = usePathname();
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsOpen(false);
    }, 150);
    setCloseTimeout(timeout);
  };

  if (hasChildren) {
    const isChildActive = item.children?.some(child => {
      const childHref = (child.fields as NavigationItem).href;
      return childHref && pathname === childHref;
    });
    const isParentActive = isActive || isChildActive;

    return (
      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button className={`flex items-center space-x-1 transition-colors font-medium ${
          isParentActive ? 'text-primary-red' : 'text-gray-700 hover:text-primary-red'
        }`}>
          <span>{item.label}</span>
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
            {item.children!.map((childEntry) => {
              const child = parseNavItem(childEntry);
              const isChildItemActive = pathname === child.href;
              return (
                <Link
                  key={child.id}
                  href={child.href || '#'}
                  className={`block px-4 py-2 transition-colors ${
                    isChildItemActive 
                      ? 'bg-primary-red/10 text-primary-red font-medium' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary-red'
                  }`}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={`transition-colors font-medium ${
        isActive ? 'text-primary-red' : 'text-gray-700 hover:text-primary-red'
      }`}
    >
      {item.label}
    </Link>
  );
}

function MobileNavItem({ item, onClose, isActive }: { item: NavigationItem & { id: string }, onClose: () => void, isActive: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const pathname = usePathname();

  if (hasChildren) {
    const isChildActive = item.children?.some(child => {
      const childHref = (child.fields as NavigationItem).href;
      return childHref && pathname === childHref;
    });
    const isParentActive = isActive || isChildActive;

    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full transition-colors font-medium px-2 py-2 ${
            isParentActive ? 'text-primary-red' : 'text-gray-700 hover:text-primary-red'
          }`}
        >
          <span>{item.label}</span>
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="pl-4 space-y-2 mt-2">
            {item.children!.map((childEntry) => {
              const child = parseNavItem(childEntry);
              const isChildItemActive = pathname === child.href;
              return (
                <Link
                  key={child.id}
                  href={child.href || '#'}
                  className={`block transition-colors px-2 py-1 ${
                    isChildItemActive 
                      ? 'text-primary-red font-medium' 
                      : 'text-gray-600 hover:text-primary-red'
                  }`}
                  onClick={onClose}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={`block transition-colors font-medium px-2 py-2 ${
        isActive ? 'text-primary-red' : 'text-gray-700 hover:text-primary-red'
      }`}
      onClick={onClose}
    >
      {item.label}
    </Link>
  );
}

export default function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Parse navigation items from Contentful or use fallback
  const navItems = settings.mainNavigation
    ?.map(parseNavItem)
    .filter(item => item.label) // Filter out items with empty labels
    .sort((a, b) => (a.order || 0) - (b.order || 0)) || [
    { id: '1', label: 'Home', href: '/', order: 1 },
    { id: '2', label: 'About Us', href: '/about-us', order: 2 },
    { id: '3', label: 'Events', href: '/events', order: 3 },
    { id: '4', label: 'Team', href: '/team', order: 4 },
    { id: '5', label: 'Contact', href: '/contact-us', order: 5 },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-red rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{settings.siteName}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <DesktopNavItem key={item.id} item={item} isActive={pathname === item.href} />
            ))}
            
            {/* Donate Button */}
            <Button asChild className="bg-primary-yellow hover:bg-primary-yellow/90 text-gray-900 font-semibold">
              <Link href={settings.donateLink || '/donate'}>Donate</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-red transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <MobileNavItem key={item.id} item={item} onClose={() => setIsOpen(false)} isActive={pathname === item.href} />
              ))}
              <Button asChild className="bg-primary-yellow hover:bg-primary-yellow/90 text-gray-900 font-semibold mt-4">
                <Link href={settings.donateLink || '/donate'}>Donate</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
