import React, { useEffect, useState } from 'react'
import { useComponentsStore } from '../../stores/components'
import type { Component } from '../../stores/components'
import { useComponentConfigStore } from '../../stores/component-config'
import HoverMask from '../HoverMask'
import SelectedMask from '../SelectedMask'

export default function EditArea() {
  const { components, setCurComponentId, curComponentId } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()
  const [hoverComponentId, setHoverComponentId] = useState<number>()

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name]
      if (!config?.dev) { // 没有对应的组件，比如：'Page'
        return null
      }
      // 渲染组件
      return React.createElement(
        config.dev,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          styles: component.styles,
          ...config.defaultProps,
          ...component.props
        },
        renderComponents(component.children || [])  // 递归渲染整个 json 树
      )
    })
  }

  const handleMouseOver: React.MouseEventHandler = (e) => {
    // console.log(e.nativeEvent.composedPath());
    const path = e.nativeEvent.composedPath()
    for (let i = 0; i < path.length; i++) {
      const ele = path[i] as HTMLElement
      const componentId = ele.dataset && ele.dataset.componentId
      if (componentId) {
        setHoverComponentId(+componentId)
        return
      }
    }
  }

  // 借助冒泡机制，点击页面上的任何组件，点击行为都会冒泡到这里
  const handleClick: React.MouseEventHandler = (e) => {
    // console.log(e.nativeEvent.composedPath());
    const path = e.nativeEvent.composedPath()
    for (let i = 0; i < path.length; i++) {
      const ele = path[i] as HTMLElement
      const componentId = ele.dataset && ele.dataset.componentId
      if (componentId) {
        setCurComponentId(+componentId)
        return
      }
    } 
    
  }

  return (
    <div className='h-[100%] edit-area' 
      onMouseOver={handleMouseOver} 
      onMouseLeave={() => setHoverComponentId(undefined)}
      onClick={handleClick}
    >
      
      {renderComponents(components)}
      {hoverComponentId && hoverComponentId !== curComponentId && (
        <HoverMask 
          componentId={hoverComponentId} 
          containerClassName='edit-area'
          portalWrapperClassName='portal-wrapper'
        />
      )}
      { curComponentId && (
        <SelectedMask 
          componentId={curComponentId} 
          containerClassName='edit-area'
          portalWrapperClassName='portal-wrapper'
        />
      )}
      <div className="portal-wrapper"></div>
    </div>
  )
}
