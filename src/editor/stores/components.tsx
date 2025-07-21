import { create } from 'zustand'
import type { CSSProperties } from 'react'

export interface Component {
  id: number,
  name: string,
  props: any,
  styles?: CSSProperties,
  desc: string,
  children?: Component[],
  parentId?: number
}
export interface State {
  components: Component[],
  curComponentId?: number | null,
  curComponent: Component | null,
  mode: 'edit' | 'preview',
}
export interface Action {
  addComponent: (component: any, parentId?: number) => void;
  deleteComponent: (componentId: number) => void;
  updateComponentProps: (componentId: number, props: any) => void;  // 更新组件属性
  setCurComponentId: (componentId: number) => void;
  updateComponentStyles: (componentId: number, styles: CSSProperties) => void;
  setMode: (mode: 'edit' | 'preview') => void;
}

export const useComponentsStore = create<State & Action>(
  (set, get) => ({
    // 数据
    components: [  // 整个项目的 json 树
      {
        id: 1,
        name: 'Page',
        props: {},
        desc: '页面'
      }
    ],
    curComponentId: null,
    curComponent: null,
    mode: 'edit',
    // 方法
    addComponent: (component, parentId) => {  // 本质上就是要将一个对象添加到另一个对象中
      set((state) => {
        if (parentId) {
          // 获取到父级对象
          const parentComponent = getComponentById(parentId, state.components)
          if (parentComponent) {
            parentComponent.children ? parentComponent.children.push(component) : parentComponent.children = [component]
          }
          component.parentId = parentId
          return {
            components: [...state.components]
          }
        }
        return {
          components: [...state.components, component]
        }
      })
    },
    deleteComponent: (componentId) => { // 在整个 json 对象中找到某一个子对象的 id 为 componentId，移除该子对象
      if (!componentId) return 
      // 找到组件
      const component = getComponentById(componentId, get().components)
      if (component?.parentId) { // 有父级
        const parentComponent = getComponentById(component.parentId, get().components)
        if (parentComponent) {
          parentComponent.children = parentComponent.children?.filter((item) => item.id !== componentId)
        }
        set({
          components: [...get().components]
        })
      }
    },
    updateComponentProps: (componentId, props) => {
      set((state) => {
        const component = getComponentById(componentId, state.components)
        if (component) {
          component.props = {...component.props, ...props}
          return {
            components: [...state.components]
          }
        }
        return {components: [...state.components]}
      })
    },
    setCurComponentId: (componentId) => {
      set((state) => ({
        curComponentId: componentId,
        curComponent: getComponentById(componentId, state.components)
      }))
    },
    updateComponentStyles: (componentId, styles) => {  // 更新组件样式
      set(state => {
        const component = getComponentById(componentId, state.components)
        if (component) {
          component.styles = {...component.styles, ...styles}
          return {
            components: [...state.components]
          }
        }
        return {
          components: [...state.components]
        }
      }) 
    },
    setMode: (mode) => {
      set({
        mode: mode
      })
    }
  })
)

export function getComponentById(id: number | null, components: Component[]): Component | null {
  if (!id) return null
  for (const component of components) {
    if (component.id === id) {
      return component
    }
    if (component.children && component.children.length > 0) { 
      const result = getComponentById(id, component.children)
      if (result) {
        return result
      }
    }
  }
  return null
}

// a = {
//   id: 1,
//   name: 'Page',
//   children: [
//     {
//       id: 3,
//       name: 'foot',
//       parentId: 1
//     }
//   ]
// }

// b = {
//   id: 2,
//   name: 'Header',
//   text: 'hello'
// }