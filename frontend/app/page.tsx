import dynamic from 'next/dynamic';

const LandingPage = dynamic(() => import('@/components/LandingPage'), {
    ssr: false,
    loading: () => <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#001529' }}>Loading CIC Core...</div>
});

export default function Home() {
    return (
        <LandingPage />
    );
}
