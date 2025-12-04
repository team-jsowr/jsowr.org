import { getHeroCarouselItems } from '@/lib/contentful-api';
import HeroSection from './_components/sections/HeroSection';
import { Button } from './_components/ui/button';
import Link from 'next/link';

export const revalidate = 3600;

export default async function Home() {
  const carouselItems = await getHeroCarouselItems();

  return (
    <main>
      {/* Hero Carousel */}
      {carouselItems.length > 0 && <HeroSection items={carouselItems} />}

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Welcome to Jain Society of Waterloo Region
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              JSOWR is dedicated to promoting Jain principles, preserving our rich cultural
              heritage, and fostering a strong sense of community among Jains in the Waterloo Region.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary-red hover:bg-primary-red/90">
                <Link href="/about-us">Learn More</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/events">View Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-primary-red rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Events</h3>
              <p className="text-gray-600 mb-4">Join us for prayers, festivals, and community gatherings</p>
              <Button asChild variant="link" className="text-primary-red">
                <Link href="/events">View Calendar</Link>
              </Button>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-primary-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600 mb-4">Connect with fellow Jains in the Waterloo Region</p>
              <Button asChild variant="link" className="text-primary-red">
                <Link href="/team">Meet Our Team</Link>
              </Button>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Support Us</h3>
              <p className="text-gray-600 mb-4">Help us continue our community service and programs</p>
              <Button asChild variant="link" className="text-primary-red">
                <Link href="/donate">Make a Donation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
