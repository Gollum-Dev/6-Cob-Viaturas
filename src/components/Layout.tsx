import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      {/* Overlay para fechar o sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-45 backdrop-blur-sm cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-col min-h-screen pt-20 w-full transition-all duration-300">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
          <Outlet />
        </main>
        <footer className="p-6 text-center border-t border-outline-variant bg-surface-container-lowest">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-relaxed">
            © 2026 CORPO DE BOMBEIROS MILITAR / 7ª CIA IND - LOGS DE FROTA DIGITAIS - DADOS OPERACIONAIS CONFIDENCIAIS
          </p>
        </footer>
      </div>
    </div>
  );
}
