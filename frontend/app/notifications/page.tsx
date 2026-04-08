'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const NotificationInbox = dynamic(() => import('@/modules/kkn/Notifications'), { ssr: false });

export default function NotificationsPage() {
    return <NotificationInbox />;
}
