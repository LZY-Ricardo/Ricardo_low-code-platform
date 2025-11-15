import { create } from 'zustand'
import type { CSSProperties } from 'react'
import type { ComponentEvent } from '../types/event'

export interface Component {
    id: number,
    name: string,
    props: any,
    styles?: CSSProperties,
    events?: {
        [eventType: string]: ComponentEvent
    },
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
    updateComponentProps: (componentId: number, props: any) => void;
    setCurComponentId: (componentId: number | null) => void;
    updateComponentStyles: (componentId: number, styles: CSSProperties) => void;
    updateComponentEvents: (componentId: number, events: Record<string, ComponentEvent>) => void;
    setMode: (mode: 'edit' | 'preview') => void;
    setComponents: (components: Component[]) => void;
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
                        if (parentComponent.children) {
                            parentComponent.children.push(component)
                        } else {
                            parentComponent.children = [component]
                        }
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
            if (!component) return

            if (component.parentId) { // 有父级，从父级的 children 中删除
                const parentComponent = getComponentById(component.parentId, get().components)
                if (parentComponent && parentComponent.children) {
                    parentComponent.children = parentComponent.children.filter((item) => item.id !== componentId)
                    set({
                        components: [...get().components]
                    })
                }
            } else { // 没有父级，从顶级组件数组中删除
                set({
                    components: get().components.filter((item) => item.id !== componentId)
                })
            }
        },
        updateComponentProps: (componentId, props) => {
            set((state) => {
                const component = getComponentById(componentId, state.components)
                if (component) {
                    component.props = { ...component.props, ...props }
                    // 如果更新的是当前选中的组件，同步更新 curComponent
                    const updatedComponent = state.curComponentId === componentId
                        ? getComponentById(componentId, [...state.components])
                        : state.curComponent
                    return {
                        components: [...state.components],
                        curComponent: updatedComponent
                    }
                }
                return { components: [...state.components] }
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
                    component.styles = { ...component.styles, ...styles }
                    // 如果更新的是当前选中的组件，同步更新 curComponent
                    const updatedComponent = state.curComponentId === componentId
                        ? getComponentById(componentId, [...state.components])
                        : state.curComponent
                    return {
                        components: [...state.components],
                        curComponent: updatedComponent
                    }
                }
                return {
                    components: [...state.components]
                }
            })
        },
        /**
         * 更新组件事件配置
         * 
         * 更新指定组件的事件配置
         * 如果更新的是当前选中的组件，会同步更新 curComponent
         * 
         * @param componentId - 组件 ID
         * @param events - 要更新的事件配置对象（格式：{ eventType: ComponentEvent }）
         * 
         * @example
         * updateComponentEvents(123, {
         *   onClick: {
         *     eventType: 'onClick',
         *     actionType: 'showMessage',
         *     actionConfig: { type: 'success', content: '点击成功' }
         *   }
         * })
         */
        updateComponentEvents: (componentId, events) => {
            set(state => {
                const component = getComponentById(componentId, state.components)
                if (component) {
                    // 合并事件配置（新配置会覆盖旧配置）
                    component.events = { ...component.events, ...events }

                    // 如果更新的是当前选中的组件，同步更新 curComponent
                    // 这样属性面板中的事件配置会立即更新
                    const updatedComponent = state.curComponentId === componentId
                        ? getComponentById(componentId, [...state.components])
                        : state.curComponent
                    return {
                        components: [...state.components],
                        curComponent: updatedComponent
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
        },
        setComponents: (components) => {
            set({
                components: components,
                curComponentId: null,
                curComponent: null
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