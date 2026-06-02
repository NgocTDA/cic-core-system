import dynamic from 'next/dynamic';

const DashboardModule = dynamic(() => import('@/modules/web-portal/Dashboard'), {
    ssr: false,
    loading: () => <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải trang chủ Portal...</div>
});

export default function Page() {
    return <DashboardModule />;
}
