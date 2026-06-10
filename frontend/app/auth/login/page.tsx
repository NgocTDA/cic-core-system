import React from 'react';
import type { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
    title: 'Đăng nhập | CIC Core System',
    description: 'Đăng nhập vào hệ thống quản lý thông tin tín dụng CIC Core System.',
};

export default function LoginPage() {
    return <LoginClient />;
}
