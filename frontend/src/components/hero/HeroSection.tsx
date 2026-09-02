import Link from 'next/link';
import { Button } from '../ui/Button';
import { ValueCard } from './ValueCard';

export const HeroSection = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
        {/* Main Hero Pitch - Col Span 8 */}
        <div className="lg:col-span-8 mb-12 lg:mb-0">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500 font-medium flex items-center gap-2 mb-4">
            PLATFORM SHARING UNTUK KESETARAAN GENDER
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-slate-900 mb-6">
            Dengarkan yang <br />
            <span className="italic">tak terucapkan.</span>
          </h1>
          
          <p className="text-slate-600 max-w-xl text-base md:text-lg mb-8 leading-relaxed">
            Ruang aman untuk membaca pengalaman, berbagi cerita, dan belajar membangun empati lintas gender.
          </p>
          
          <div className="flex flex-wrap items-center gap-6">
            <Button size="lg" asChild>
              <Link href="/cerita/buat">Buat cerita ↗</Link>
            </Button>
            
            <Link href="#koleksi-suara" className="text-sm font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors">
              Mulai membaca ↓
            </Link>
          </div>
        </div>

        {/* Value Proposition Feature Box - Col Span 4 */}
        <div className="lg:col-span-4">
          <ValueCard />
        </div>
      </div>
    </section>
  );
};
