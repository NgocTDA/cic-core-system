import dynamic from 'next/dynamic';

const OpsSupportDashboard = dynamic(() => import('@/modules/ops-support/Dashboard'), {
    ssr: false,
    loading: () => <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>
});

export default function Page() {
    return <OpsSupportDashboard />;
}
