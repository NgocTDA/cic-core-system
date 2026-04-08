import dynamic from 'next/dynamic';

const DataGovernanceDashboard = dynamic(() => import('@/modules/data-governance/Dashboard'), {
    ssr: false,
    loading: () => <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>
});

export default function Page() {
    return <DataGovernanceDashboard />;
}
