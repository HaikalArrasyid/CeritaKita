import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  AlertTriangle, 
  MessageSquare, 
  FileText, 
  Ban,
  Settings 
} from 'lucide-react';
import { ReactNode } from 'react';

const sidebarLinks = [
  { href: '/moderasi', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/moderasi/users', label: 'Pengguna', icon: Users },
  { href: '/moderasi/stories', label: 'Cerita', icon: BookOpen },
  { href: '/moderasi/reports', label: 'Laporan', icon: AlertTriangle },
  { href: '/moderasi/queue', label: 'Antrean', icon: FileText },
  { href: '/moderasi/comments', label: 'Komentar', icon: MessageSquare },
  { href: '/moderasi/articles', label: 'Artikel Edukasi', icon: FileText },
  { href: '/moderasi/banned-words', label: 'Kata Terlarang', icon: Ban },
  { href: '/moderasi/settings', label: 'Pengaturan', icon: Settings },
];

export default function ModerasiLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 flex flex-col md:flex-row items-start w-full bg-slate-50 min-h-[calc(100vh-73px)]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 sticky top-[73px] md:h-[calc(100vh-73px)] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-serif font-bold text-slate-900 mb-6">Panel Admin</h2>
          <nav className="space-y-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <Icon size={20} />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full p-4 md:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
