import dynamic from 'next/dynamic';

const AnalyticsReportingDashboard = dynamic(() => import('@/modules/analytics-reporting/Dashboard'), {
    ssr: false,
    loading: () => <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>
});

export default function Page() {
    return <AnalyticsReportingDashboard />;
}
