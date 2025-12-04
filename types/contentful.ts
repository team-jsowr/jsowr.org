import { Document } from '@contentful/rich-text-types';
import { Asset, Entry } from 'contentful';

export interface NavigationItem {
  label: string;
  href?: string;
  order?: number;
  children?: any[]; // Entry references
}

export interface SiteSettings {
  siteName: string;
  siteDescription?: string;
  logo?: Asset;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialMediaLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  donateLink?: string;
  mainNavigation?: any[]; // Entry references
}

// Section Types for Page Builder
export interface HeroSection {
  title: string;
  subtitle?: string;
  backgroundImage?: Asset;
  ctaText?: string;
  ctaLink?: string;
  isCarousel?: boolean;
  carouselItems?: any[];
}

export interface ContentSection {
  title?: string;
  content: Document;
  backgroundColor?: string;
  layout?: 'single-column' | 'two-column' | 'three-column';
}

export interface GallerySection {
  title?: string;
  images: Asset[];
  layout?: 'grid' | 'carousel' | 'masonry';
}

export interface EventListSection {
  title?: string;
  showUpcoming?: boolean;
  limit?: number;
}

export interface TeamSection {
  title?: string;
  members: any[];
}

export interface ContactSection {
  title?: string;
  showForm?: boolean;
  contactInfo?: Document;
}

export type Section = any;

// Main Page Type with Sections
export interface Page {
  title: string;
  slug: string;
  sections?: Section[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface Event {
  title: string;
  slug: string;
  date: string;
  location?: string;
  shortDescription: string;
  description: Document;
  featuredImage?: Asset;
  gallery?: Asset[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  photo?: Asset;
  email?: string;
  phone?: string;
  order?: number;
}

export interface HeroCarouselItem {
  title: string;
  subtitle?: string;
  image: Asset;
  ctaText?: string;
  ctaLink?: string;
  order?: number;
}

export type ContentfulEntry<T> = any;
