import dynamic from 'next/dynamic';

const ProductMgmtDashboard = dynamic(() => import('@/modules/product-mgmt/Dashboard'), {
    ssr: false,
    loading: () => <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>
});

export default function Page() {
    return <ProductMgmtDashboard />;
}
