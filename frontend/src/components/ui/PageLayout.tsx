import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

interface PageLayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, noPadding }) => {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        padding: noPadding ? 0 : isMobile ? '8px' : '16px 24px 24px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

export default PageLayout;
