import { useState, useEffect, useRef } from 'react'
import { Segmented } from 'antd';
import ComponentAttr from './ComponentAttr'
import ComponentStyle from './ComponentStyle'
import ComponentEvent from './ComponentEvent'

export default function Setting() {
    const [key, setKey] = useState('属性')
    const [resizeKey, setResizeKey] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const rafIdRef = useRef<number | null>(null)

    // 监听容器尺寸变化，强制 Segmented 重新渲染
    useEffect(() => {
        const container = containerRef.current
        if (!container) {
            return
        }

        const resizeObserver = new ResizeObserver(() => {
            // 使用 requestAnimationFrame 防抖，避免过于频繁的更新
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current)
            }

            rafIdRef.current = requestAnimationFrame(() => {
                // 当容器尺寸变化时，更新 resizeKey 来强制 Segmented 重新渲染
                // 由于 value 和 onChange 保持不变，选中状态不会丢失
                setResizeKey(prev => prev + 1)
                rafIdRef.current = null
            })
        })

        resizeObserver.observe(container)

        return () => {
            resizeObserver.disconnect()
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current)
            }
        }
    }, [])

    return (
        <div ref={containerRef} className="h-full flex flex-col">
            <div className="flex-shrink-0 p-4 border-b border-border-light bg-bg-secondary">
                <Segmented
                    key={resizeKey}
                    value={key}
                    options={['属性', '外观', '事件']}
                    block
                    onChange={setKey}
                    className='shadow-soft'
                />
            </div>
            <div className='flex-1 overflow-y-auto p-4 scrollbar-thin'>
                {
                    key === '属性' && <ComponentAttr />
                }
                {
                    key === '外观' && <ComponentStyle />
                }
                {
                    key === '事件' && <ComponentEvent />
                }
            </div>
        </div>
    )
}
