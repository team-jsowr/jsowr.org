import Link from 'next/link';
import { Button } from '@/app/_components/ui/button';

export default function NotFound() {
  return (
    <main className="relative bg-primary-red min-h-[70vh] flex items-center justify-center px-4">
      <svg
        width="70"
        height="70"
        viewBox="0 0 70 70"
        className="absolute top-4 left-4 opacity-60 pointer-events-none"
        aria-hidden="true"
      >
        <path d="M2 2 Q2 35 35 35 Q2 35 2 68" stroke="#C89B3C" strokeWidth="1.5" fill="none" />
        <circle cx="2" cy="2" r="4" fill="#C89B3C" />
      </svg>
      <svg
        width="70"
        height="70"
        viewBox="0 0 70 70"
        className="absolute top-4 right-4 opacity-60 pointer-events-none -scale-x-100"
        aria-hidden="true"
      >
        <path d="M2 2 Q2 35 35 35 Q2 35 2 68" stroke="#C89B3C" strokeWidth="1.5" fill="none" />
        <circle cx="2" cy="2" r="4" fill="#C89B3C" />
      </svg>

      <div className="max-w-xl mx-auto text-center text-primary-white">
        <p className="text-primary-yellow font-semibold tracking-widest mb-4">404</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Page Not Found</h1>
        <p className="text-lg text-primary-white/85 mb-8">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Button asChild size="lg" className="bg-primary-yellow hover:bg-primary-yellow/90 text-primary-red font-semibold">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </main>
  );
}
