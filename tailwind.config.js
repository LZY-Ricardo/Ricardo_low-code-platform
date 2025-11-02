/** @type {import('tailwindcss').Config} */
export default {
  content: [ // 配置 tailwindcss 扫描的文件
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#f8f9fa',
        'bg-secondary': '#ffffff',
        'border-light': '#e5e7eb',
        'text-primary': '#1f2937',
        'text-secondary': '#6b7280',
        'accent': '#3b82f6',
        'accent-hover': '#2563eb',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      },
    },
  },
  plugins: [],
}

