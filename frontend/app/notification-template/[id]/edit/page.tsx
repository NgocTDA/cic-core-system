'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const TemplateFormPage = dynamic(() => import('@/modules/kkn/NotificationTemplate/TemplateFormPage'), { ssr: false });

export default function EditTemplatePage() {
    return <TemplateFormPage />;
}
