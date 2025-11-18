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
    createProject,
    renameProject,
    deleteProject
  } = useProjectStore()
  
  const [renameModalVisible, setRenameModalVisible] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(null)
  const [exportModalVisible, setExportModalVisible] = useState(false)

  const handleSave = async () => {
    const success = await saveCurrentProject(components)
    if (success) {
      message.success('项目保存成功')
    } else {
      message.error('项目保存失败')
    }
  }

  const handleBackToProjects = async () => {
    await saveCurrentProject(components)
    navigate('/projects')
  }

  const handleNewProject = async () => {
    await saveCurrentProject(components)
    const newProj = await createProject()
    if (newProj) {
      // 导航到新项目的 URL
      navigate(`/editor/${newProj.id}`)
      message.success(`已创建项目：${newProj.name}`)
    }
  }

  const handleSwitchProject = async (projectId: string) => {
    // 如果切换到当前项目，不做任何操作
    if (currentProject?.id === projectId) {
      return
    }

    await saveCurrentProject(components)
    // 通过导航到新的 URL 来触发项目切换
    // 实际的切换逻辑由 editor/index.tsx 的 useEffect 处理
    navigate(`/editor/${projectId}`)
  }

  const handleRenameClick = (projectId: string, currentName: string) => {
    setRenamingProjectId(projectId)
    setNewProjectName(currentName)
    setRenameModalVisible(true)
  }

  const handleRenameConfirm = async () => {
    if (!renamingProjectId || !newProjectName.trim()) {
      message.warning('请输入项目名称')
      return
    }

    const success = await renameProject(renamingProjectId, newProjectName.trim())
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
      onOk: async () => {
        const success = await deleteProject(projectId)
        if (success) {
          message.success('项目已删除')
          // 如果删除的是当前项目，deleteProject 会自动切换到其他项目
          // 需要导航到新的当前项目
          const { currentProject: newCurrentProject } = useProjectStore.getState()
          if (newCurrentProject) {
            navigate(`/editor/${newCurrentProject.id}`)
          } else {
            // 如果没有项目了，返回项目列表
            navigate('/projects')
          }
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
