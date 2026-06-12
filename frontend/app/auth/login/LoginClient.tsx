'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    const [utcTime, setUtcTime] = useState<Date | null>(null);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [captchaText, setCaptchaText] = useState('');

    const generateCaptchaText = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaText(result);
    };

    useEffect(() => {
        // Set initial time on mount to prevent SSR hydration mismatch
        setUtcTime(new Date());
        generateCaptchaText();
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
        // If captcha is shown, validate it
        if (showCaptcha) {
            if (!values.captcha || values.captcha.toUpperCase() !== captchaText) {
                message.error('Mã xác thực không chính xác!');
                generateCaptchaText();
                return;
            }
        }

        // Mock authentication simulation
        // Success credentials: admin / admin or admin@cic.org.vn / admin
        const isMockSuccess = 
            (values.usernameOrEmail === 'admin' || values.usernameOrEmail === 'admin@cic.org.vn') && 
            values.password === 'admin';

        if (isMockSuccess) {
            message.success('Đăng nhập thành công!');
            setFailedAttempts(0);
            setShowCaptcha(false);
            // Redirect to home screen (which displays list of subsystems)
            router.push('/');
        } else {
            const nextFailed = failedAttempts + 1;
            setFailedAttempts(nextFailed);
            
            if (nextFailed >= 5) {
                setShowCaptcha(true);
                generateCaptchaText();
                message.error('Tài khoản hoặc mật khẩu không đúng! Vui lòng nhập mã xác thực.');
            } else {
                message.error(`Tài khoản hoặc mật khẩu không đúng! (Còn ${5 - nextFailed} lần đăng nhập sai trước khi yêu cầu Captcha)`);
            }
        }
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
                                    className="w-8 h-8" 
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

                        {/* Form Credentials */}
                        <Form
                            name="login_form"
                            layout="vertical"
                            onFinish={onFinish}
                            requiredMark={false}
                            className="space-y-4"
                        >
                            <Form.Item
                                label={<span className="font-semibold text-xs text-gray-700">Tài khoản hoặc Email</span>}
                                name="usernameOrEmail"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tài khoản hoặc email!' }
                                ]}
                            >
                                <Input 
                                    id="usernameOrEmail"
                                    placeholder="username hoặc username@cic.org.vn" 
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
                                className="mb-4"
                            >
                                <Input.Password 
                                    id="password"
                                    placeholder="••••••••" 
                                    size="large"
                                    className="rounded-md border-gray-300 focus:border-[#1677ff] focus:ring-1 focus:ring-[#1677ff]"
                                />
                            </Form.Item>

                            {/* Captcha Field (Visible after 5 failed attempts) */}
                            {showCaptcha && (
                                <Form.Item
                                    label={<span className="font-semibold text-xs text-gray-700">Mã xác thực (Captcha)</span>}
                                    name="captcha"
                                    rules={[{ required: true, message: 'Vui lòng nhập mã xác thực!' }]}
                                    className="mb-6"
                                >
                                    <div className="flex gap-3 items-center">
                                        {/* Styled Captcha Display Box */}
                                        <div 
                                            className="flex-1 h-[40px] rounded-md border border-gray-300 flex items-center justify-center font-mono font-bold text-lg tracking-widest relative overflow-hidden select-none"
                                            style={{
                                                backgroundImage: `radial-gradient(circle, ${colors.border.base} 8%, transparent 9%)`,
                                                backgroundSize: '10px 10px',
                                                backgroundColor: colors.bg.subtle,
                                                color: colors.primary[500],
                                            }}
                                        >
                                            {/* Noise lines */}
                                            <div className="absolute inset-0 opacity-15 pointer-events-none">
                                                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                                    <line x1="0" y1="10" x2="150" y2="30" stroke={colors.primary[500]} strokeWidth="1.5" />
                                                    <line x1="10" y1="35" x2="140" y2="5" stroke={colors.primary[500]} strokeWidth="1.5" />
                                                </svg>
                                            </div>
                                            <span className="relative z-10 skew-x-12 pointer-events-none">
                                                {captchaText}
                                            </span>
                                        </div>
                                        
                                        {/* Refresh Button */}
                                        <Button 
                                            type="default" 
                                            onClick={generateCaptchaText}
                                            className="h-[40px] px-3 flex items-center justify-center rounded-md border-gray-300 hover:border-[#1677ff] hover:text-[#1677ff]"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
                                            </svg>
                                        </Button>
                                    </div>
                                    
                                    <Input 
                                        id="captcha"
                                        placeholder="Nhập 5 ký tự ở trên" 
                                        size="large"
                                        className="rounded-md border-gray-300 focus:border-[#1677ff] focus:ring-1 focus:ring-[#1677ff] mt-2"
                                        autoComplete="off"
                                    />
                                </Form.Item>
                            )}

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
