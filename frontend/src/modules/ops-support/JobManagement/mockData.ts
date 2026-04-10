
export interface Job {
    id: string;
    code: string;
    name: string;
    description: string;
    type: 'DATABASE' | 'REPORTING' | 'CLEANUP' | 'SYNC';
    status: 'RUNNING' | 'IDLE' | 'SCHEDULED' | 'FAILED';
    lastRun: string;
    nextRun?: string;
    priority: 'High' | 'Medium' | 'Low';
    progress?: number;
    metrics: {
        startTime: string;
        duration: string;
        totalRecords: string;
        errors: number;
        throughput: string;
    };
    history: {
        status: 'SUCCESS' | 'FAILED';
        timestamp: string;
    }[];
}

export const MOCK_JOBS: Job[] = [
    {
        id: '001',
        code: 'SYNC-DB-01',
        name: 'Đồng bộ dữ liệu Giao dịch',
        description: 'Đồng bộ dữ liệu từ Core sang Data Warehouse hàng ngày',
        type: 'DATABASE',
        status: 'RUNNING',
        lastRun: '2 phút trước',
        priority: 'High',
        progress: 65,
        metrics: {
            startTime: '12:00:00',
            duration: '01:12:45',
            totalRecords: '1.8M',
            errors: 0,
            throughput: '4,281 rec/s'
        },
        history: Array.from({ length: 30 }).map((_, i) => ({
            status: i === 12 ? 'FAILED' : 'SUCCESS',
            timestamp: new Date(Date.now() - i * 3600000).toISOString()
        }))
    },
    {
        id: '002',
        code: 'REPT-MON-99',
        name: 'Báo cáo quyết toán tháng',
        description: 'Tổng hợp số liệu và xuất file PDF/Excel báo cáo tháng',
        type: 'REPORTING',
        status: 'IDLE',
        lastRun: 'Hôm qua 18:30',
        priority: 'Medium',
        metrics: {
            startTime: '18:30:00',
            duration: '00:45:12',
            totalRecords: '12,500',
            errors: 0,
            throughput: '276 rec/s'
        },
        history: Array.from({ length: 30 }).map((_, i) => ({
            status: 'SUCCESS',
            timestamp: new Date(Date.now() - i * 3600000).toISOString()
        }))
    },
    {
        id: '003',
        code: 'CLN-LOG-05',
        name: 'Dọn dẹp Log hệ thống',
        description: 'Xóa log cũ trên 90 ngày và nén dữ liệu archive',
        type: 'CLEANUP',
        status: 'SCHEDULED',
        lastRun: '15/05/2026',
        nextRun: 'Hôm nay 23:00',
        priority: 'Low',
        metrics: {
            startTime: '-',
            duration: '-',
            totalRecords: '-',
            errors: 0,
            throughput: '-'
        },
        history: Array.from({ length: 30 }).map((_, i) => ({
            status: 'SUCCESS',
            timestamp: new Date(Date.now() - i * 3600000).toISOString()
        }))
    },
    {
        id: '004',
        code: 'SYNC-MSB-01',
        name: 'Sync Gateway MSB',
        description: 'Đồng bộ trạng thái kết nối với Gateway đối tác MSB',
        type: 'SYNC',
        status: 'FAILED',
        lastRun: '10 phút trước',
        priority: 'High',
        metrics: {
            startTime: '17:45:00',
            duration: '00:02:12',
            totalRecords: '0',
            errors: 504,
            throughput: '0 rec/s'
        },
        history: Array.from({ length: 30 }).map((_, i) => ({
            status: i < 3 ? 'FAILED' : 'SUCCESS',
            timestamp: new Date(Date.now() - i * 3600000).toISOString()
        }))
    }
];

export const MOCK_LOGS = [
    { id: 'LOG-001', level: 'INFO', message: 'Khởi tạo tiến trình đồng bộ dữ liệu...', timestamp: '17:50:00 09-04-26' },
    { id: 'LOG-002', level: 'INFO', message: 'Kết nối thành công tới máy chủ MSB Gateway', timestamp: '17:50:05 09-04-26' },
    { id: 'LOG-003', level: 'DEBUG', message: 'Bắt đầu quét batch dữ liệu #4021', timestamp: '17:50:10 09-04-26' },
    { id: 'LOG-004', level: 'ERROR', message: 'Connection timeout (Port: 5432) - Đang thử lại...', timestamp: '17:52:00 09-04-26' },
    { id: 'LOG-005', level: 'INFO', message: 'Tiến trình tạm dừng do lỗi ngoại lệ', timestamp: '17:55:00 09-04-26' },
];
