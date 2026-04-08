'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const NotificationTemplate = dynamic(() => import('@/modules/kkn/NotificationTemplate'), { ssr: false });

export default function NotificationTemplatePage() {
    return <NotificationTemplate />;
}
