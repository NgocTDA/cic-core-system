import dynamic from 'next/dynamic';

const SendBalanceModule = dynamic(() => import('@/modules/web-portal/SendBalance'), {
    ssr: false,
    loading: () => <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải giao diện cân đối...</div>
});

export default function Page() {
    return <SendBalanceModule />;
}
