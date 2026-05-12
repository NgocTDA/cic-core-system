import dynamic from 'next/dynamic';

const LandingPage = dynamic(() => import('@/components/LandingPage'), {
    ssr: false,
    loading: () => <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa', color: 'rgba(0, 0, 0, 0.45)' }}>Loading CIC Core...</div>
});

export default function Home() {
    return (
        <LandingPage />
    );
}
