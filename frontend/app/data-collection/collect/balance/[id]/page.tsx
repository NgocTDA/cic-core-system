import { CollectBalanceDetailPage } from '@/modules/data-collection/CollectBalance/CollectBalanceDetailPage';

export const metadata = {
  title: 'Chi tiết thông tin cân đối',
};

export default function Page({ params }: { params: { id: string } }) {
  return <CollectBalanceDetailPage id={params.id} />;
}
