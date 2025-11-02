import { Space, Button } from 'antd'
import { useComponentsStore } from '../../stores/components'

export default function Header() {
  const { mode, setMode } = useComponentsStore((state: any) => state)
  console.log(mode);
  

  return (
    <div className='w-[100%] h-[100%]'>
      <div className='h-[64px] flex justify-between items-center px-6'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-soft'>
            <span className='text-white text-sm font-bold'>低</span>
          </div>
          <h1 className='text-lg font-semibold text-text-primary m-0'>低码编辑器</h1>
        </div>
        <Space>
          {
            mode === 'edit' && (
              <Button 
                type="primary" 
                onClick={() => setMode('preview')}
                className='shadow-soft'
              >
                预览
              </Button>
            )
          }
          {
            mode === 'preview' && (
              <Button 
                type="primary" 
                onClick={() => setMode('edit')}
                className='shadow-soft'
              >
                退出预览
              </Button>
            )
          }
        </Space>
      </div>
    </div>
  )
}
