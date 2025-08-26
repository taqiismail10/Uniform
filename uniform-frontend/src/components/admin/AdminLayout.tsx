// uniform-frontend/src/components/admin/AdminLayout.tsx

import type { ReactNode } from 'react';
import { Header } from './Header';
import { Breadcrumb } from './Breadcrumb';

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminLayout({ children, activeTab, onTabChange }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={onTabChange} />
      <Breadcrumb activeTab={activeTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}