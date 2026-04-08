'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const VariableRegistry = dynamic(() => import('@/modules/kkn/VariableRegistry'), { ssr: false });

export default function VariableRegistryPage() {
    return <VariableRegistry />;
}
