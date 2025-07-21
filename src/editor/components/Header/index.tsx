import { Space, Button } from 'antd'
import { useComponentsStore } from '../../stores/components'

export default function Header() {
  const { mode, setMode } = useComponentsStore((state: any) => state)
  console.log(mode);
  

  return (
    <div className='w-[100%] h-[100%]'>
      <div className='h-[50px] flex justify-between items-center px-[20px]'>
        <div>低码编辑器</div>
        <Space>
          {
            mode === 'edit' && (
              <Button type="primary" onClick={() => setMode('preview')}>预览</Button>
            )
          }
          {
            mode === 'preview' && (
              <Button type="primary" onClick={() => setMode('edit')}>退出预览</Button>
            )
          }
        </Space>
      </div>
    </div>
  )
}
