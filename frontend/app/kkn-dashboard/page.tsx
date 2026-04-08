import dynamic from 'next/dynamic';

const KKNDashboard = dynamic(() => import('@/modules/kkn/KKNDashboard'), {
    ssr: false,
    loading: () => <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Dashboard...</div>
});

export default function Page() {
    return (
        <KKNDashboard />
    );
}
