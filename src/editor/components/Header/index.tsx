import { Space, Button, Dropdown, Modal, Input, message } from 'antd'
import { SaveOutlined, FolderOpenOutlined, PlusOutlined, EditOutlined, DeleteOutlined, LeftOutlined, ExportOutlined } from '@ant-design/icons'
import { useComponentsStore } from '../../stores/components'
import { useProjectStore } from '../../stores/project'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MenuProps } from 'antd'
import ExportModal from '../ExportModal'

export default function Header() {
  const navigate = useNavigate()
  const { mode, setMode, components } = useComponentsStore()
  const { 
    currentProject, 
    projects, 
    saveCurrentProject, 
    switchProject, 
    createProject,
    renameProject,
    deleteProject
  } = useProjectStore()
  const setComponents = useComponentsStore((state) => state.setComponents)
  
  const [renameModalVisible, setRenameModalVisible] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(null)
  const [exportModalVisible, setExportModalVisible] = useState(false)

  const handleSave = () => {
    const success = saveCurrentProject(components)
    if (success) {
      message.success('项目保存成功')
    } else {
      message.error('项目保存失败')
    }
  }

  const handleBackToProjects = () => {
    saveCurrentProject(components)
    navigate('/projects')
  }

  const handleNewProject = () => {
    saveCurrentProject(components)
    const newProj = createProject()
    setComponents(newProj.components)
    message.success(`已创建项目：${newProj.name}`)
  }

  const handleSwitchProject = (projectId: string) => {
    saveCurrentProject(components)
    const project = switchProject(projectId)
    if (project) {
      setComponents(project.components)
      message.success(`已切换到项目：${project.name}`)
    }
  }

  const handleRenameClick = (projectId: string, currentName: string) => {
    setRenamingProjectId(projectId)
    setNewProjectName(currentName)
    setRenameModalVisible(true)
  }

  const handleRenameConfirm = () => {
    if (!renamingProjectId || !newProjectName.trim()) {
      message.warning('请输入项目名称')
      return
    }
    
    const success = renameProject(renamingProjectId, newProjectName.trim())
    if (success) {
      message.success('重命名成功')
      setRenameModalVisible(false)
      setRenamingProjectId(null)
      setNewProjectName('')
    } else {
      message.error('重命名失败')
    }
  }

  const handleDeleteProject = (projectId: string, projectName: string) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除项目"${projectName}"吗？此操作不可恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const success = deleteProject(projectId)
        if (success) {
          const newCurrentProject = useProjectStore.getState().currentProject
          if (newCurrentProject) {
            setComponents(newCurrentProject.components)
          }
          message.success('项目已删除')
        } else {
          message.error('删除失败')
        }
      }
    })
  }

  const projectMenuItems: MenuProps['items'] = projects.map(project => ({
    key: project.id,
    label: (
      <div className="flex items-center justify-between w-full">
        <span 
          className="flex-1"
          onClick={() => handleSwitchProject(project.id)}
        >
          {project.name}
          {currentProject?.id === project.id && ' (当前)'}
        </span>
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          <EditOutlined 
            className="text-blue-500 hover:text-blue-700"
            onClick={(e) => {
              e.stopPropagation()
              handleRenameClick(project.id, project.name)
            }}
          />
          <DeleteOutlined 
            className="text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteProject(project.id, project.name)
            }}
          />
        </Space>
      </div>
    )
  }))

  return (
    <div className='w-[100%] h-[100%]'>
      <div className='h-[64px] flex justify-between items-center px-6'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-soft'>
            <span className='text-white text-sm font-bold'>低</span>
          </div>
          <div className='flex items-center gap-2'>
            <Button 
              type="text" 
              icon={<LeftOutlined />}
              onClick={handleBackToProjects}
              className='text-gray-600 hover:text-accent'
            >
              我的项目
            </Button>
            {currentProject && (
              <>
                <span className='text-gray-400'>/</span>
                <span className='text-base font-medium text-text-primary'>{currentProject.name}</span>
              </>
            )}
          </div>
        </div>
        <Space>
          {mode === 'edit' && (
            <>
              <Button 
                icon={<SaveOutlined />}
                onClick={handleSave}
              >
                保存
              </Button>
              <Button 
                icon={<PlusOutlined />}
                onClick={handleNewProject}
              >
                新建项目
              </Button>
              <Dropdown
                menu={{ items: projectMenuItems }}
                trigger={['click']}
              >
                <Button icon={<FolderOpenOutlined />}>
                  项目列表 ({projects.length})
                </Button>
              </Dropdown>
              <Button
                icon={<ExportOutlined />}
                onClick={() => setExportModalVisible(true)}
              >
                导出
              </Button>
              <Button
                type="primary"
                onClick={() => setMode('preview')}
                className='shadow-soft'
              >
                预览
              </Button>
            </>
          )}
          {mode === 'preview' && (
            <Button 
              type="primary" 
              onClick={() => setMode('edit')}
              className='shadow-soft'
            >
              退出预览
            </Button>
          )}
        </Space>
      </div>

      <Modal
        title="重命名项目"
        open={renameModalVisible}
        onOk={handleRenameConfirm}
        onCancel={() => {
          setRenameModalVisible(false)
          setRenamingProjectId(null)
          setNewProjectName('')
        }}
        okText="确认"
        cancelText="取消"
      >
        <Input
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="请输入新的项目名称"
          onPressEnter={handleRenameConfirm}
        />
      </Modal>

      <ExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
      />
    </div>
  )
}
