import dynamic from 'next/dynamic';

const DataCollectionDashboard = dynamic(() => import('@/modules/data-collection/Dashboard'), {
    ssr: false,
    loading: () => <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>
});

export default function Page() {
    return <DataCollectionDashboard />;
}
