'use client';

import { Button, Result } from 'antd';
import Link from 'next/link';
import { PageLayout, SectionCard } from '@/components/ui';
import useHeaderActions from '@/hooks/useHeaderActions';

interface UnavailableFeatureProps {
  title: string;
  description?: string;
  returnPath?: string;
  returnLabel?: string;
}

export default function UnavailableFeature({
  title,
  description = 'Chức năng này chưa được triển khai. Bạn có thể quay về trang chủ để chọn chức năng khác.',
  returnPath = '/',
  returnLabel = 'Về trang chủ',
}: UnavailableFeatureProps) {
  useHeaderActions({ title }, [title]);

  return (
    <PageLayout>
      <SectionCard>
        <Result
          status="info"
          title={title}
          subTitle={description}
          extra={<Link href={returnPath}><Button type="primary">{returnLabel}</Button></Link>}
        />
      </SectionCard>
    </PageLayout>
  );
}
