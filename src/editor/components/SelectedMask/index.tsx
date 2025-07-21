import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Space, Popconfirm } from 'antd'
import { getComponentById, useComponentsStore } from '../../stores/components'
import { DeleteOutlined } from '@ant-design/icons'

interface SelectedMaskProps {
  containerClassName: string
  portalWrapperClassName: string
  componentId: number
}

export default function SelectedMask({ containerClassName, portalWrapperClassName, componentId }: SelectedMaskProps) {
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  })

  const { components, curComponentId, deleteComponent, setCurComponentId } = useComponentsStore()

  useEffect(() => {
    updatePosition()
  }, [componentId])

  useEffect(() => {
    const resizeHandler = () => {
      updatePosition()
    }
    window.addEventListener('resize', resizeHandler)

    return () => {  // 组件卸载时，移除事件监听器
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])



  function updatePosition() {
    if (!componentId) {
      return
    }
    // 获取整个中间画布区域的 div 结构
    const container = document.querySelector(`.${containerClassName}`)
    if (!container) return
    // 被点击的组件的 div 结构
    const node = document.querySelector(`[data-component-id="${componentId}"]`)
    if (!node) return
    // 获取到 node 的几何属性
    const { top, left, width, height } = node.getBoundingClientRect()
    const { top: containerTop, left: containerLeft } = container.getBoundingClientRect()

    let labelTop = top - containerTop + container.scrollTop
    let labelLeft = left - containerLeft + width

    if (labelTop <= 0) {
      labelTop -= -20
    }

    setPosition({
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft + container.scrollTop,
      width,
      height,
      labelTop,
      labelLeft,
    })

  }

  const el = useMemo(() => {
    return document.querySelector(`.${portalWrapperClassName}`)
  }, [])

  const curComponent = useMemo(() => {  // 找到被点击的组件对象
    return getComponentById(componentId, components)
  }, [componentId])

  const handleDelete = () => {
    // 移除该组件（本质上就是将仓库中的json 数据剔除掉某一个小结点）
    deleteComponent(curComponentId!)
    setCurComponentId(null!)
  }



  return createPortal((
    <>
      <div
        style={{
          position: "absolute",
          left: position.left,
          top: position.top,
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          border: "1px dashed blue",
          pointerEvents: "none",
          width: position.width,
          height: position.height,
          zIndex: 14,
          borderRadius: 4,
          boxSizing: 'border-box',
        }}
      />
      <div
        style={{
          position: "absolute",
          left: position.labelLeft,
          top: position.labelTop,
          fontSize: "14px",
          zIndex: 15,
          display: (!position.width || position.width < 10) ? "none" : "inline",
          transform: 'translate(-100%, -100%)',
        }}
      >
        <Space>
          <div
            style={{
              padding: '0 8px',
              backgroundColor: 'blue',
              borderRadius: 4,
              color: '#fff',
              cursor: "pointer",
              whiteSpace: 'nowrap',
            }}
          >
            {curComponent?.desc}
          </div>
          {curComponentId !== 1 && (
            <div style={{ padding: '0 8px', backgroundColor: 'blue' }}>
              <Popconfirm
                title="确认删除？"
                okText={'确认'}
                cancelText={'取消'}
                onConfirm={handleDelete}
              >
                <DeleteOutlined style={{ color: '#fff' }} />
              </Popconfirm>
            </div>
          )}
        </Space>
      </div>
    </>
  ), el as HTMLElement)
}
