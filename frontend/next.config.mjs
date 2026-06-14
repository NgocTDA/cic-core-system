/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    transpilePackages: [
        'antd',
        '@ant-design/icons',
        '@ant-design/nextjs-registry',
        'rc-util',
        'rc-pagination',
        'rc-picker',
        'rc-notification',
        'rc-tooltip',
        'rc-tree',
        'rc-table',
        'dayjs',
    ],
};

export default nextConfig;
