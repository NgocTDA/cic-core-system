import type { Config } from "tailwindcss";

const config: Config = {
    presets: [require("@ntda/forest-design-system/tailwind")],
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Subsystem accents for CIC Core System
                'sub-kkn':        '#f59e0b',
                'sub-collection': '#38bdf8',
                'sub-product':    '#2c795b',
                'sub-ops':        '#8b5cf6',
                'sub-analytics':  '#f43f5e',
                'sub-governance': '#14b8a6',
            },
            width: {
                sidebar:  '256px',
                'sidebar-collapsed': '64px',
            },
            height: {
                header: '56px',
            },
        },
    },
    plugins: [],
    corePlugins: {
        preflight: false, // Disabled to avoid conflicts with Ant Design
    },
};

export default config;
