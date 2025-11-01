import type { CommonComponentProps } from '../../interface'
// import { useDrop } from 'react-dnd'
// import { useComponentsStore } from '../../stores/components'
// import { useComponentConfigStore } from '../../stores/component-config'
import { useMaterialDrop } from '../../hooks/useMaterialDrop'

export default function Container({ id, children, styles }: CommonComponentProps) {
    // const { addComponent } = useComponentsStore()
    // const { componentConfig } = useComponentConfigStore()
    // 能接受拖拽进来的组件
    // const [{canDrop}, dropRef] = useDrop(() => {
    //   return {
    //     accept: ['Button', 'Container'],
    //     drop: (item: {type: string}, monitor) => {
    //       const didDrop = monitor.didDrop()  // 是否被动冒泡接受其他组件
    //       if (didDrop) return
    //       // console.log(item)
    //       const props = componentConfig?.[item.type]?.defaultProps
    //       addComponent({
    //         id: new Date().getTime(),
    //         name: item.type,
    //         props: props
    //       }, id)
    //     },
    //     collect: (monitor) => {
    //       return {
    //         canDrop: monitor.canDrop()
    //       }
    //     }
    //   }
    // })

    const { canDrop, dropRef, contextHolder } = useMaterialDrop(['Button', 'Container', 'Text', 'Image', 'Title', 'Input', 'Card'], id)

    return (
        <>
            {contextHolder}  {/* 消息提示容器 */}
            <div
                data-component-id={id}
                // 绑定拖拽接收
                ref={dropRef as any}
                // 根据拖拽状态调整样式
                className={`
          min-h-[100px] 
          p-[20px] 
          ${canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'}
        `}
                style={styles}
            >
                {children}
            </div>
        </>
    )
}
