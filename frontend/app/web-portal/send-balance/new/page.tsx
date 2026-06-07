import dynamic from 'next/dynamic';

const SendBalanceFormPage = dynamic(() => import('@/modules/web-portal/SendBalance/SendBalanceFormPage'), {
    ssr: false,
    loading: () => <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải biểu mẫu nhập liệu...</div>
});

export default function Page() {
    return <SendBalanceFormPage />;
}
