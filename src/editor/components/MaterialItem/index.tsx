import React from 'react'
import { useDrag } from 'react-dnd'

export interface MaterialItemProps {
  name: string
}

export default function MaterialItem(props: MaterialItemProps) {
  const [_, dragRef] = useDrag(() => ({
    type: props.name,
    item: {  // 被拖动的内容
      type: props.name
    }
  }))
  
  return (
    <div
      ref={dragRef as any}
      className='
        border-dashed
        border-[1px]
        border-[#000]
        py-[8px]
        px-[10px]
        inline-block
        bg-white
        m-[10px]
        cursor-move
        hover:bg-[#ccc]
      '
    >
      {props.name}
    </div>
  )
}
