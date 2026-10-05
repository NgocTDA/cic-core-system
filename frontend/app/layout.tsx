import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import '@ntda/forest-design-system/css';
import '@ntda/forest-design-system/fonts.css';
import './globals.css';
import './global.scss';

export const metadata: Metadata = {
    title: 'CIC Core System',
    description: 'Internal Credit Information Management System — CIC',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi" data-theme="light">
            <body>
                <AntdRegistry>
                    <ClientLayout>
                        {children}
                    </ClientLayout>
                </AntdRegistry>
            </body>
        </html>
    );
}
