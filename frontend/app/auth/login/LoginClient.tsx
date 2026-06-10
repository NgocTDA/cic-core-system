'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { colors } from '@/design-system';

interface Timezone {
    label: string;
    offset: number;
    x: string;
}

const timezones: Timezone[] = [
    { label: 'UTC-8', offset: -8, x: '16.67%' },
    { label: 'UTC-6', offset: -6, x: '25.00%' },
    { label: 'UTC-4', offset: -4, x: '33.33%' },
    { label: 'UTC-2', offset: -2, x: '41.67%' },
    { label: 'UTC+0', offset: 0, x: '50.00%' },
    { label: 'UTC+2', offset: 2, x: '58.33%' },
    { label: 'UTC+4', offset: 4, x: '66.67%' },
    { label: 'UTC+6', offset: 6, x: '75.00%' },
    { label: 'UTC+8', offset: 8, x: '83.33%' },
];

export default function LoginClient() {
    const [utcTime, setUtcTime] = useState<Date | null>(null);

    useEffect(() => {
        // Set initial time on mount to prevent SSR hydration mismatch
        setUtcTime(new Date());
        const timer = setInterval(() => {
            setUtcTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const getFormattedTime = (date: Date | null, offset: number) => {
        if (!date) return '--:-- --';
        // Calculate the target time by shifting the UTC timestamp by the offset hours
        const targetTime = new Date(date.getTime() + offset * 60 * 60 * 1000);
        
        let hours = targetTime.getUTCHours();
        const minutes = targetTime.getUTCMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // convert 0 to 12
        const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
        
        return `${hours}:${minutesStr} ${ampm}`;
    };

    const onFinish = (values: any) => {
        message.success(`Đăng nhập thành công với tài khoản: ${values.email}`);
        console.log('Login values:', values);
    };

    return (
        <div 
            className="min-h-screen w-full flex flex-col justify-between relative overflow-hidden select-none"
            style={{ backgroundColor: colors.bg.page }}
        >
            {/* World Map Dotted Background (Desktop only) */}
            <div 
                className="hidden md:block absolute inset-0 bg-center bg-no-repeat pointer-events-none z-0 transition-opacity duration-500"
                style={{
                    backgroundImage: "url('/world-map-dots.svg')",
                    backgroundSize: '100% auto',
                    opacity: 0.55,
                }}
            />

            {/* Vertical dashed timezone grid lines (Desktop only) */}
            <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
                {timezones.map((tz) => (
                    <div
                        key={tz.label}
                        className="absolute top-0 bottom-0 w-px"
                        style={{
                            left: tz.x,
                            borderLeft: '1px dashed rgba(0, 0, 0, 0.05)',
                        }}
                    />
                ))}
            </div>

            {/* Main Login Card Wrapper */}
            <main className="flex-1 flex items-center justify-center p-4 z-10">
                <h1 className="sr-only">Đăng nhập CIC Core System</h1>
                
                <div 
                    className="w-full max-w-[440px] bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl"
                    style={{ borderRadius: '16px' }}
                >
                    {/* Card Body */}
                    <div className="p-8 pb-6 flex-1 flex flex-col justify-center">
                        {/* Brand Header */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="flex items-center gap-2 mb-1.5">
                                <svg 
                                    className="w-8 h-8 text-[#1677ff]" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor" 
                                    strokeWidth={2.5}
                                    style={{ color: colors.primary[500] }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                                    CIC <span style={{ color: colors.primary[500] }}>Core</span>
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium text-center">
                                Chào mừng trở lại! Đăng nhập để tiếp tục
                            </p>
                        </div>

                        {/* SSO Sign In Buttons */}
                        <div className="flex flex-col gap-2.5">
                            <button
                                id="google-login-btn"
                                type="button"
                                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-md font-semibold text-sm transition-all duration-200 bg-[#262626] text-white hover:bg-black active:scale-[0.98] cursor-pointer border-none"
                                onClick={() => message.info('Đăng nhập bằng Google đang phát triển')}
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                                </svg>
                                <span>Đăng nhập bằng Google</span>
                            </button>
                            
                            <button
                                id="microsoft-login-btn"
                                type="button"
                                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-md font-semibold text-sm transition-all duration-200 bg-[#f5f5f5] text-gray-800 border border-gray-200 hover:bg-[#e8e8e8] active:scale-[0.98] cursor-pointer"
                                onClick={() => message.info('Đăng nhập bằng Microsoft đang phát triển')}
                            >
                                <svg className="w-4 h-4" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 0h11v11H0z" fill="#F25022"/>
                                    <path d="M12 0h11v11H12z" fill="#7FBA00"/>
                                    <path d="M0 12h11v11H0z" fill="#00A1F1"/>
                                    <path d="M12 12h11v11H12z" fill="#FFB900"/>
                                </svg>
                                <span>Đăng nhập bằng Microsoft</span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative my-6 flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <span className="relative px-3 bg-white text-xs text-gray-400 uppercase tracking-wider font-semibold">
                                hoặc
                            </span>
                        </div>

                        {/* Form Credentials */}
                        <Form
                            name="login_form"
                            layout="vertical"
                            onFinish={onFinish}
                            requiredMark={false}
                            className="space-y-4"
                        >
                            <Form.Item
                                label={<span className="font-semibold text-xs text-gray-700">Email</span>}
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không đúng định dạng!' }
                                ]}
                            >
                                <Input 
                                    id="email"
                                    placeholder="you@example.com" 
                                    size="large" 
                                    className="rounded-md border-gray-300 focus:border-[#1677ff] focus:ring-1 focus:ring-[#1677ff]"
                                />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <div className="flex justify-between items-center w-full">
                                        <span className="font-semibold text-xs text-gray-700">Mật khẩu</span>
                                        <a href="/auth/forgot-password" className="text-xs font-semibold hover:text-[#0958d9] transition-colors" style={{ color: colors.primary[500] }}>
                                            Quên?
                                        </a>
                                    </div>
                                }
                                name="password"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                                className="mb-6"
                            >
                                <Input.Password 
                                    id="password"
                                    placeholder="••••••••" 
                                    size="large"
                                    className="rounded-md border-gray-300 focus:border-[#1677ff] focus:ring-1 focus:ring-[#1677ff]"
                                />
                            </Form.Item>

                            <Form.Item className="mb-0">
                                <Button
                                    id="login-submit-btn"
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    block
                                    className="font-semibold text-sm border-none rounded-md h-[42px] flex items-center justify-center shadow-sm cursor-pointer"
                                    style={{ 
                                        backgroundColor: colors.primary[500],
                                    }}
                                >
                                    Tiếp tục
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>

                    {/* Card Footer */}
                    <div 
                        className="border-t border-gray-100 px-8 py-4 flex items-center justify-center gap-2 text-xs font-medium text-gray-500"
                        style={{ backgroundColor: colors.bg.subtle }}
                    >
                        <a href="/auth/register" className="hover:text-gray-900 transition-colors">
                            Tạo tài khoản
                        </a>
                        <span>•</span>
                        <a href="/auth/saml" className="hover:text-gray-900 transition-colors">
                            Đăng nhập bằng SAML/OIDC
                        </a>
                    </div>
                </div>
            </main>

            {/* Bottom Real-time Timezone Bar (Desktop only) */}
            <div className="hidden md:block w-full h-16 relative pointer-events-none z-10 border-t border-gray-100 bg-white/20 backdrop-blur-[2px]">
                {timezones.map((tz) => (
                    <div
                        key={tz.label}
                        className="absolute bottom-4 flex flex-col items-center text-center transition-all duration-300"
                        style={{
                            left: tz.x,
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <span 
                            className="text-[11px] font-bold tracking-tight mb-0.5" 
                            style={{ color: colors.subsystem.kkn }}
                        >
                            {getFormattedTime(utcTime, tz.offset)}
                        </span>
                        <span 
                            className="text-[9px] font-semibold tracking-wider" 
                            style={{ color: colors.text.secondary }}
                        >
                            {tz.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
