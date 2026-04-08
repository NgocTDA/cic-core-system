'use client';

import dynamic from 'next/dynamic';

const TemplateFormPage = dynamic(() => import('@/modules/kkn/NotificationTemplate/TemplateFormPage'), { ssr: false });

export default function NewTemplatePage() {
    return <TemplateFormPage />;
}
