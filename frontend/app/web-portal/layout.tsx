'use client';

import React, { useState } from 'react';
import PortalHeader from '@/layouts/PortalHeader';
import PortalMenu from '@/layouts/PortalMenu';
import { colors } from '@/design-system';

interface PortalLayoutProps {
  children: React.ReactNode;
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const [lang, setLang] = useState('VI');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: colors.bg.page
    }}>
      {/* KHỐI 1: HEADER (Portal Header) */}
      <PortalHeader currentLang={lang} onLangChange={setLang} />

      {/* KHỐI 2: MENU NGANG (Portal Multi-level Menu) */}
      <PortalMenu />

      {/* KHỐI 3: NỘI DUNG CHÍNH (Main Content Area) */}
      <main style={{
        flex: 1,
        width: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}>
        {children}
      </main>
    </div>
  );
}
