import { create } from 'zustand'
import type { Component } from './components'
import { StorageManager, type Project } from '../utils/storage'
import * as projectsApi from '../../api/projects'
import type { ProjectData } from '../../api/projects'
import { message } from 'antd'

interface ProjectState {
    currentProject: Project | null
    projects: Project[]
    loading: boolean
}

interface ProjectActions {
    loadProjects: () => Promise<void>
    createProject: (name?: string, components?: Component[]) => Promise<Project>
    saveCurrentProject: (components: Component[]) => Promise<boolean>
    switchProject: (projectId: string) => Promise<Project | null>
    deleteProject: (projectId: string) => Promise<boolean>
    renameProject: (projectId: string, newName: string) => Promise<boolean>
    setCurrentProject: (project: Project | null) => void
}

const DEFAULT_COMPONENTS: Component[] = [
    {
        id: 1,
        name: 'Page',
        props: {},
        desc: '页面'
    }
]

/**
 * 将后端项目数据转换为前端 Project 类型
 */
function convertToProject(data: ProjectData): Project {
    return {
        id: data.id,
        name: data.name,
        components: data.components,
        createdAt: new Date(data.createdAt).getTime(),
        updatedAt: new Date(data.updatedAt).getTime(),
    }
}

/**
 * 检查是否已登录
 */
function isAuthenticated(): boolean {
    return !!localStorage.getItem('lowcode_token')
}

export const useProjectStore = create<ProjectState & ProjectActions>((set, get) => ({
    currentProject: null,
    projects: [],
    loading: false,

    /**
     * 加载项目列表（优先从云端加载）
     */
    loadProjects: async () => {
        set({ loading: true })
        
        try {
            // 如果已登录，从云端加载
            if (isAuthenticated()) {
                const response = await projectsApi.getProjects(1, 100)
                const cloudProjects = response.projects.map(convertToProject)
                
                // 同步到 LocalStorage 缓存
                cloudProjects.forEach(project => {
                    StorageManager.saveProject(project)
                })
                
                set({ projects: cloudProjects, loading: false })
                
                // 设置当前项目
                if (cloudProjects.length > 0) {
                    const lastProjectId = StorageManager.getLastProjectId()
                    const lastProject = lastProjectId 
                        ? cloudProjects.find(p => p.id === lastProjectId) 
                        : cloudProjects[0]
                    set({ currentProject: lastProject || cloudProjects[0] })
                } else {
                    // 如果没有项目，创建默认项目
                    const defaultProject = await get().createProject('默认项目', DEFAULT_COMPONENTS)
                    set({ currentProject: defaultProject })
                }
            } else {
                // 未登录，从 LocalStorage 加载
                const localProjects = StorageManager.getAllProjects()
                set({ projects: localProjects, loading: false })
                
                if (localProjects.length === 0) {
                    const defaultProject = await get().createProject('默认项目', DEFAULT_COMPONENTS)
                    set({ currentProject: defaultProject })
                } else {
                    const lastProjectId = StorageManager.getLastProjectId()
                    const lastProject = lastProjectId 
                        ? localProjects.find(p => p.id === lastProjectId) 
                        : localProjects[0]
                    set({ currentProject: lastProject || localProjects[0] })
                }
            }
        } catch (error) {
            console.error('Failed to load projects from cloud, fallback to local:', error)
            // 云端加载失败，降级到 LocalStorage
            const localProjects = StorageManager.getAllProjects()
            set({ projects: localProjects, loading: false })
            
            if (localProjects.length === 0) {
                const defaultProject = await get().createProject('默认项目', DEFAULT_COMPONENTS)
                set({ currentProject: defaultProject })
            } else {
                const lastProjectId = StorageManager.getLastProjectId()
                const lastProject = lastProjectId 
                    ? localProjects.find(p => p.id === lastProjectId) 
                    : localProjects[0]
                set({ currentProject: lastProject || localProjects[0] })
            }
        }
    },

    /**
     * 创建项目（同步到云端和本地）
     */
    createProject: async (name, components) => {
        const projectName = name || `未命名项目_${Date.now()}`
        const projectComponents = components || DEFAULT_COMPONENTS
        
        try {
            // 如果已登录，创建到云端
            if (isAuthenticated()) {
                const cloudProject = await projectsApi.createProject({
                    name: projectName,
                    components: projectComponents,
                })
                
                const newProject = convertToProject(cloudProject)
                
                // 同步到 LocalStorage
                StorageManager.saveProject(newProject)
                
                const projects = [...get().projects, newProject]
                set({ 
                    projects,
                    currentProject: newProject
                })
                
                return newProject
            } else {
                // 未登录，只保存到 LocalStorage
                const newProject = StorageManager.createProject(projectName, projectComponents)
                StorageManager.saveProject(newProject)
                
                const projects = StorageManager.getAllProjects()
                set({ 
                    projects,
                    currentProject: newProject
                })
                
                return newProject
            }
        } catch (error) {
            console.error('Failed to create project to cloud, fallback to local:', error)
            message.error('创建项目失败，已保存到本地')
            
            // 降级到 LocalStorage
            const newProject = StorageManager.createProject(projectName, projectComponents)
            StorageManager.saveProject(newProject)
            
            const projects = StorageManager.getAllProjects()
            set({ 
                projects,
                currentProject: newProject
            })
            
            return newProject
        }
    },

    /**
     * 保存当前项目（同步到云端和本地）
     */
    saveCurrentProject: async (components) => {
        const { currentProject } = get()
        if (!currentProject) {
            console.warn('No current project to save')
            return false
        }

        const updatedProject: Project = {
            ...currentProject,
            components,
            updatedAt: Date.now()
        }

        try {
            // 如果已登录，保存到云端
            if (isAuthenticated()) {
                await projectsApi.updateProject(currentProject.id, {
                    components,
                })
                
                // 同步到 LocalStorage
                StorageManager.saveProject(updatedProject)
                
                const projects = get().projects.map(p => 
                    p.id === updatedProject.id ? updatedProject : p
                )
                
                set({ 
                    currentProject: updatedProject,
                    projects 
                })
                
                return true
            } else {
                // 未登录，只保存到 LocalStorage
                const success = StorageManager.saveProject(updatedProject)
                
                if (success) {
                    const projects = StorageManager.getAllProjects()
                    set({ 
                        currentProject: updatedProject,
                        projects 
                    })
                }
                
                return success
            }
        } catch (error) {
            console.error('Failed to save project to cloud, saved to local:', error)
            
            // 降级到 LocalStorage
            const success = StorageManager.saveProject(updatedProject)
            
            if (success) {
                const projects = StorageManager.getAllProjects()
                set({ 
                    currentProject: updatedProject,
                    projects 
                })
            }
            
            return success
        }
    },

    /**
     * 切换项目
     */
    switchProject: async (projectId) => {
        try {
            // 如果已登录，从云端获取最新数据
            if (isAuthenticated()) {
                const cloudProject = await projectsApi.getProject(projectId)
                const project = convertToProject(cloudProject)
                
                // 同步到 LocalStorage
                StorageManager.saveProject(project)
                StorageManager.setLastProjectId(projectId)
                
                set({ currentProject: project })
                return project
            } else {
                // 未登录，从 LocalStorage 获取
                const project = StorageManager.getProject(projectId)
                
                if (!project) {
                    console.warn(`Project ${projectId} not found`)
                    return null
                }

                StorageManager.setLastProjectId(projectId)
                set({ currentProject: project })
                
                return project
            }
        } catch (error) {
            console.error('Failed to switch project from cloud, fallback to local:', error)
            
            // 降级到 LocalStorage
            const project = StorageManager.getProject(projectId)
            
            if (!project) {
                console.warn(`Project ${projectId} not found`)
                return null
            }

            StorageManager.setLastProjectId(projectId)
            set({ currentProject: project })
            
            return project
        }
    },

    /**
     * 删除项目（同步到云端和本地）
     */
    deleteProject: async (projectId) => {
        const { currentProject } = get()
        
        try {
            // 如果已登录，删除云端项目
            if (isAuthenticated()) {
                await projectsApi.deleteProject(projectId)
                
                // 同步删除 LocalStorage
                StorageManager.deleteProject(projectId)
                
                const updatedProjects = get().projects.filter(p => p.id !== projectId)
                
                if (currentProject?.id === projectId) {
                    if (updatedProjects.length > 0) {
                        set({ 
                            currentProject: updatedProjects[0],
                            projects: updatedProjects
                        })
                    } else {
                        const newProject = await get().createProject('默认项目', DEFAULT_COMPONENTS)
                        set({ 
                            currentProject: newProject,
                            projects: [newProject]
                        })
                    }
                } else {
                    set({ projects: updatedProjects })
                }
                
                return true
            } else {
                // 未登录，只删除 LocalStorage
                const success = StorageManager.deleteProject(projectId)
                
                if (!success) return false

                const updatedProjects = StorageManager.getAllProjects()
                
                if (currentProject?.id === projectId) {
                    if (updatedProjects.length > 0) {
                        set({ 
                            currentProject: updatedProjects[0],
                            projects: updatedProjects
                        })
                    } else {
                        const newProject = await get().createProject('默认项目', DEFAULT_COMPONENTS)
                        set({ 
                            currentProject: newProject,
                            projects: [newProject]
                        })
                    }
                } else {
                    set({ projects: updatedProjects })
                }
                
                return true
            }
        } catch (error) {
            console.error('Failed to delete project from cloud, fallback to local:', error)
            message.error('删除云端项目失败，已删除本地缓存')
            
            // 降级到 LocalStorage
            const success = StorageManager.deleteProject(projectId)
            
            if (!success) return false

            const updatedProjects = StorageManager.getAllProjects()
            
            if (currentProject?.id === projectId) {
                if (updatedProjects.length > 0) {
                    set({ 
                        currentProject: updatedProjects[0],
                        projects: updatedProjects
                    })
                } else {
                    const newProject = await get().createProject('默认项目', DEFAULT_COMPONENTS)
                    set({ 
                        currentProject: newProject,
                        projects: [newProject]
                    })
                }
            } else {
                set({ projects: updatedProjects })
            }
            
            return true
        }
    },

    /**
     * 重命名项目（同步到云端和本地）
     */
    renameProject: async (projectId, newName) => {
        try {
            // 如果已登录，更新云端
            if (isAuthenticated()) {
                await projectsApi.updateProject(projectId, { name: newName })
                
                // 同步到 LocalStorage
                StorageManager.renameProject(projectId, newName)
                
                const projects = get().projects.map(p => 
                    p.id === projectId ? { ...p, name: newName, updatedAt: Date.now() } : p
                )
                
                const { currentProject } = get()
                const updatedCurrentProject = currentProject?.id === projectId
                    ? projects.find(p => p.id === projectId) || currentProject
                    : currentProject
                
                set({ 
                    projects,
                    currentProject: updatedCurrentProject
                })
                
                return true
            } else {
                // 未登录，只更新 LocalStorage
                const success = StorageManager.renameProject(projectId, newName)
                
                if (success) {
                    const projects = StorageManager.getAllProjects()
                    const { currentProject } = get()
                    
                    const updatedCurrentProject = currentProject?.id === projectId
                        ? projects.find(p => p.id === projectId) || currentProject
                        : currentProject
                    
                    set({ 
                        projects,
                        currentProject: updatedCurrentProject
                    })
                }
                
                return success
            }
        } catch (error) {
            console.error('Failed to rename project in cloud, fallback to local:', error)
            message.error('重命名云端项目失败，已更新本地缓存')
            
            // 降级到 LocalStorage
            const success = StorageManager.renameProject(projectId, newName)
            
            if (success) {
                const projects = StorageManager.getAllProjects()
                const { currentProject } = get()
                
                const updatedCurrentProject = currentProject?.id === projectId
                    ? projects.find(p => p.id === projectId) || currentProject
                    : currentProject
                
                set({ 
                    projects,
                    currentProject: updatedCurrentProject
                })
            }
            
            return success
        }
    },

    setCurrentProject: (project) => {
        set({ currentProject: project })
    }
}))
