import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function PanduanPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Panduan Ruang Aman</h1>
          <p className="text-slate-600 text-lg">
            Halaman ini berisi panduan dan aturan untuk menjaga komunitas CeritaKita tetap aman dan inklusif.
          </p>
        </div>

        <div className="space-y-8 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-100">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
              Saling Menghormati
            </h2>
            <p className="text-slate-600 leading-relaxed ml-10">
              Kami menghargai keberagaman pandangan dan pengalaman setiap anggota komunitas. Dilarang keras melakukan pelecehan, perundungan (bullying), ujaran kebencian, atau diskriminasi dalam bentuk apa pun. Mari bangun lingkungan yang saling mendukung.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</span>
              Privasi dan Keamanan
            </h2>
            <p className="text-slate-600 leading-relaxed ml-10">
              Lindungi informasi pribadi Anda dan orang lain. Jangan pernah membagikan data sensitif, seperti alamat rumah, nomor telepon, atau detail keuangan di ruang publik. Hargai privasi setiap pengguna di platform ini.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">3</span>
              Larangan Konten Berbahaya
            </h2>
            <p className="text-slate-600 leading-relaxed ml-10">
              CeritaKita tidak menoleransi penyebaran konten yang mempromosikan kekerasan, melukai diri sendiri, aktivitas ilegal, atau eksploitasi. Konten eksplisit atau tidak pantas akan segera ditindaklanjuti oleh tim moderasi kami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">4</span>
              Laporkan Pelanggaran
            </h2>
            <p className="text-slate-600 leading-relaxed ml-10">
              Jika Anda melihat sesuatu yang melanggar panduan ini atau membuat Anda merasa tidak nyaman, jangan ragu untuk menggunakan fitur pelaporan atau menghubungi tim kami. Kami siap membantu memastikan ruang ini tetap aman.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="secondary" className="px-8">
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
