import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, List, Typography, Tag, Space } from 'antd';
import { SearchOutlined, DatabaseOutlined, BookOutlined, ClockCircleOutlined, EnterOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Text } = Typography;

interface SearchResult {
    id: string;
    title: string;
    type: 'Asset' | 'Term' | 'Recent';
    path: string;
}

const MOCK_RESULTS: SearchResult[] = [
    { id: '1', title: 'Customer Profile Data', type: 'Asset', path: '/assets/1' },
    { id: '2', title: 'Transaction History', type: 'Asset', path: '/assets/2' },
    { id: '3', title: 'KYC Process', type: 'Term', path: '/glossary/3' },
    { id: '4', title: 'Credit Score Definition', type: 'Term', path: '/glossary/4' },
    { id: '5', title: 'Dữ liệu định danh khách hàng', type: 'Recent', path: '/assets/5' },
];

const CommandPalette: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<any>(null);
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setResults(MOCK_RESULTS);
            setSelectedIndex(0);
        }
    }, [open]);

    const handleSearch = (val: string) => {
        setSearch(val);
        if (!val) {
            setResults(MOCK_RESULTS);
        } else {
            const filtered = MOCK_RESULTS.filter(r => 
                r.title.toLowerCase().includes(val.toLowerCase()) || 
                r.type.toLowerCase().includes(val.toLowerCase())
            );
            setResults(filtered);
        }
        setSelectedIndex(0);
    };

    const handleSelect = (result: SearchResult) => {
        router.push(result.path);
        setOpen(false);
        setSearch('');
    };

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
        } else if (e.key === 'Escape') {
            setOpen(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            closable={false}
            width={600}
            styles={{ 
                body: { padding: 0 },
                content: { borderRadius: 12, overflow: 'hidden' }
            }}
            centered
        >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
                <Input
                    ref={inputRef}
                    prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.25)', fontSize: 20 }} />}
                    placeholder="Tìm kiếm tài sản, thuật ngữ, hành động... (Ctrl+K)"
                    variant="borderless"
                    style={{ fontSize: 18 }}
                    value={search}
                    onChange={e => handleSearch(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                />
            </div>
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                <List
                    dataSource={results}
                    renderItem={(item, index) => (
                        <List.Item
                            onClick={() => handleSelect(item)}
                            style={{
                                cursor: 'pointer',
                                padding: '12px 20px',
                                background: index === selectedIndex ? '#f0f7ff' : 'transparent',
                                borderLeft: index === selectedIndex ? '4px solid #1677ff' : '4px solid transparent',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <div style={{ 
                                    width: 32, 
                                    height: 32, 
                                    borderRadius: 6, 
                                    background: '#f5f5f5', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    marginRight: 16
                                }}>
                                    {item.type === 'Asset' && <DatabaseOutlined style={{ color: '#722ed1' }} />}
                                    {item.type === 'Term' && <BookOutlined style={{ color: '#fa8c16' }} />}
                                    {item.type === 'Recent' && <ClockCircleOutlined style={{ color: '#8c8c8c' }} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text strong={index === selectedIndex}>{item.title}</Text>
                                    <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
                                        {item.type} • {item.path}
                                    </div>
                                </div>
                                {index === selectedIndex && (
                                    <Space size={4} style={{ color: 'rgba(0,0,0,0.25)', fontSize: 12 }}>
                                        <EnterOutlined />
                                        <span>chọn</span>
                                    </Space>
                                )}
                            </div>
                        </List.Item>
                    )}
                />
            </div>
            <div style={{ padding: '12px 20px', background: '#f9f9f9', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
                <Space size={16}>
                    <Space size={4}>
                        <Tag style={{ margin: 0, fontSize: 10 }}>↑↓</Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>Điều hướng</Text>
                    </Space>
                    <Space size={4}>
                        <Tag style={{ margin: 0, fontSize: 10 }}>Enter</Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>Mở</Text>
                    </Space>
                    <Space size={4}>
                        <Tag style={{ margin: 0, fontSize: 10 }}>Esc</Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>Thoát</Text>
                    </Space>
                </Space>
                <Text type="secondary" style={{ fontSize: 12 }}>Command Palette v1.0</Text>
            </div>
        </Modal>
    );
};

export default CommandPalette;
