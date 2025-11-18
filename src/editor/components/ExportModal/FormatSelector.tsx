import { Radio, Space } from 'antd'
import { ExportFormat } from '@/editor/utils/exporters'

interface FormatOption {
  value: ExportFormat
  label: string
  icon: string
  description: string
  disabled?: boolean
  badge?: string
}

interface FormatSelectorProps {
  value: ExportFormat
  onChange: (format: ExportFormat) => void
}

/**
 * 导出格式选择器组件
 */
export default function FormatSelector({ value, onChange }: FormatSelectorProps) {
  const formats: FormatOption[] = [
    {
      value: ExportFormat.JSON,
      label: 'JSON 配置',
      icon: '📄',
      description: '纯配置文件，用于备份和版本控制'
    },
    {
      value: ExportFormat.HTML,
      label: '静态 HTML',
      icon: '🌐',
      description: '单文件网页，可直接在浏览器打开'
    },
    {
      value: ExportFormat.REACT,
      label: 'React 项目',
      icon: '⚛️',
      description: '完整的 React + Vite 项目源码'
    },
    {
      value: ExportFormat.VUE,
      label: 'Vue 项目',
      icon: '💚',
      description: '完整的 Vue 3 + Vite 项目源码'
    },
    {
      value: ExportFormat.SNIPPET,
      label: '代码片段',
      icon: '📝',
      description: 'JSX/Vue 组件代码，可复制使用'
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: 12, fontSize: 14, fontWeight: 500 }}>
        选择导出格式
      </div>
      <Radio.Group
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%' }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          {formats.map((format) => (
            <Radio
              key={format.value}
              value={format.value}
              disabled={format.disabled}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d9d9d9',
                borderRadius: 8,
                marginLeft: 0,
                backgroundColor: format.disabled ? '#fafafa' : 'white',
                ...(value === format.value && !format.disabled
                  ? {
                      borderColor: '#1677ff',
                      backgroundColor: '#f0f5ff'
                    }
                  : {})
              }}
            >
              <div style={{ marginLeft: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{format.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>
                    {format.label}
                  </span>
                  {format.badge && (
                    <span
                      style={{
                        fontSize: 12,
                        padding: '0 8px',
                        borderRadius: 10,
                        backgroundColor: '#f0f0f0',
                        color: '#666'
                      }}
                    >
                      {format.badge}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: format.disabled ? '#999' : '#666',
                    marginTop: 4,
                    marginLeft: 28
                  }}
                >
                  {format.description}
                </div>
              </div>
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </div>
  )
}
