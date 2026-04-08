import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import './globals.css';
import './global.scss';

export const metadata: Metadata = {
    title: 'CIC Core System',
    description: 'Project restructured with Next.js v14.2.5',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
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
