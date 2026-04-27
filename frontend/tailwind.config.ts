import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            // ─── Colors ──────────────────────────────────────────────
            colors: {
                primary: {
                    50:  '#e6f4ff',
                    100: '#bae0ff',
                    200: '#91caff',
                    300: '#69b1ff',
                    400: '#4096ff',
                    500: '#1677ff',
                    600: '#0958d9',
                    700: '#003eb3',
                    800: '#002c8c',
                    900: '#001d66',
                    DEFAULT: '#1677ff',
                },
                success:  { DEFAULT: '#52c41a', light: '#f6ffed', dark: '#389e0d' },
                warning:  { DEFAULT: '#faad14', light: '#fffbe6', dark: '#d48806' },
                error:    { DEFAULT: '#ff4d4f', light: '#fff2f0', dark: '#cf1322' },
                info:     { DEFAULT: '#1677ff', light: '#e6f4ff', dark: '#0958d9' },
                // Subsystem accents
                'sub-kkn':        '#fa8c16',
                'sub-collection': '#1890ff',
                'sub-product':    '#52c41a',
                'sub-ops':        '#722ed1',
                'sub-analytics':  '#eb2f96',
                'sub-governance': '#13c2c2',
                // Sidebar
                sidebar:  '#2e3035',
                // Surfaces
                page:     '#f5f7fa',
            },

            // ─── Font family ──────────────────────────────────────────
            fontFamily: {
                sans: ["'Inter'", '-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'Roboto', 'sans-serif'],
                mono: ["'JetBrains Mono'", "'Fira Code'", 'Consolas', "'Courier New'", 'monospace'],
            },

            // ─── Font size ────────────────────────────────────────────
            fontSize: {
                'xs':   ['11px', { lineHeight: '1.5' }],
                'sm':   ['12px', { lineHeight: '1.5' }],
                'base': ['14px', { lineHeight: '1.5' }],
                'md':   ['16px', { lineHeight: '1.5' }],
                'lg':   ['18px', { lineHeight: '1.375' }],
                'xl':   ['20px', { lineHeight: '1.375' }],
                '2xl':  ['24px', { lineHeight: '1.25' }],
                '3xl':  ['30px', { lineHeight: '1.25' }],
                '4xl':  ['36px', { lineHeight: '1.25' }],
                '5xl':  ['48px', { lineHeight: '1' }],
            },

            // ─── Spacing ──────────────────────────────────────────────
            spacing: {
                '0':   '0px',
                '0.5': '2px',
                '1':   '4px',
                '2':   '8px',
                '3':   '12px',
                '4':   '16px',
                '5':   '20px',
                '6':   '24px',
                '7':   '28px',
                '8':   '32px',
                '10':  '40px',
                '12':  '48px',
                '16':  '64px',
                '20':  '80px',
                '24':  '96px',
            },

            // ─── Border radius ─────────────────────────────────────────
            borderRadius: {
                none: '0px',
                xs:   '2px',
                sm:   '4px',
                DEFAULT: '6px',
                lg:   '8px',
                xl:   '12px',
                '2xl':'16px',
                '3xl':'24px',
                full: '9999px',
            },

            // ─── Box shadow ───────────────────────────────────────────
            boxShadow: {
                xs:   '0 1px 2px rgba(0, 0, 0, 0.04)',
                sm:   '0 2px 8px rgba(0, 0, 0, 0.06)',
                DEFAULT: '0 4px 16px rgba(0, 0, 0, 0.08)',
                lg:   '0 8px 24px rgba(0, 0, 0, 0.10)',
                xl:   '0 16px 48px rgba(0, 0, 0, 0.14)',
                card: '0 2px 8px rgba(0, 0, 0, 0.05)',
                menu: '0 6px 16px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.04)',
            },

            // ─── Transition ────────────────────────────────────────────
            transitionTimingFunction: {
                standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
                enter:    'cubic-bezier(0.0, 0, 0.2, 1)',
                exit:     'cubic-bezier(0.4, 0, 1, 1)',
                spring:   'cubic-bezier(0.34, 1.56, 0.64, 1)',
            },

            // ─── Z-index ──────────────────────────────────────────────
            zIndex: {
                hide:      '-1',
                base:      '0',
                raised:    '1',
                dropdown:  '1000',
                sticky:    '1100',
                overlay:   '1200',
                modal:     '1300',
                popover:   '1400',
                toast:     '1500',
                tooltip:   '1600',
            },

            // ─── Layout dimensions ────────────────────────────────────
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
