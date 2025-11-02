import { useState } from 'react'
import { Segmented } from 'antd';
import ComponentAttr from './ComponentAttr'
import ComponentStyle from './ComponentStyle'
import ComponentEvent from './ComponentEvent'

export default function Setting() {
    const [key, setKey] = useState('属性')

    return (
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0">
                <Segmented value={key} options={['属性', '外观', '事件']} block onChange={setKey} />
            </div>
            <div className='pt-[20px] flex-1 overflow-y-auto'>
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
