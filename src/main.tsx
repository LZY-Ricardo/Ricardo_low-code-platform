import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@ant-design/v5-patch-for-react-19';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

createRoot(document.getElementById('root')!).render(
    <ConfigProvider
        locale={zhCN}
        theme={{
            token: {
                colorPrimary: '#3b82f6',
                borderRadius: 6,
                colorBorder: '#e5e7eb',
                colorBgContainer: '#ffffff',
                colorText: '#1f2937',
                colorTextSecondary: '#6b7280',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            },
            components: {
                Button: {
                    borderRadius: 6,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                },
                Card: {
                    borderRadius: 8,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
                },
                Segmented: {
                    borderRadius: 6,
                },
                Input: {
                    borderRadius: 6,
                },
                Select: {
                    borderRadius: 6,
                },
            },
        }}
    >
        <DndProvider backend={HTML5Backend}>
            <App />
        </DndProvider>
    </ConfigProvider>
)
