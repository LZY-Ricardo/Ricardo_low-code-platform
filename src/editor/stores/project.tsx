import { create } from 'zustand'
import type { Component } from './components'
import { StorageManager, type Project } from '../utils/storage'

interface ProjectState {
    currentProject: Project | null
    projects: Project[]
}

interface ProjectActions {
    loadProjects: () => void
    createProject: (name?: string, components?: Component[]) => Project
    saveCurrentProject: (components: Component[]) => boolean
    switchProject: (projectId: string) => Project | null
    deleteProject: (projectId: string) => boolean
    renameProject: (projectId: string, newName: string) => boolean
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

export const useProjectStore = create<ProjectState & ProjectActions>((set, get) => ({
    currentProject: null,
    projects: [],

    loadProjects: () => {
        const projects = StorageManager.getAllProjects()
        set({ projects })

        if (projects.length === 0) {
            const defaultProject = get().createProject('默认项目', DEFAULT_COMPONENTS)
            set({ currentProject: defaultProject })
        } else {
            const lastProjectId = StorageManager.getLastProjectId()
            const lastProject = lastProjectId 
                ? projects.find(p => p.id === lastProjectId) 
                : projects[0]
            
            set({ currentProject: lastProject || projects[0] })
        }
    },

    createProject: (name, components) => {
        const projectName = name || `未命名项目_${Date.now()}`
        const projectComponents = components || DEFAULT_COMPONENTS
        
        const newProject = StorageManager.createProject(projectName, projectComponents)
        StorageManager.saveProject(newProject)
        
        const projects = StorageManager.getAllProjects()
        set({ 
            projects,
            currentProject: newProject
        })
        
        return newProject
    },

    saveCurrentProject: (components) => {
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

        const success = StorageManager.saveProject(updatedProject)
        
        if (success) {
            const projects = StorageManager.getAllProjects()
            set({ 
                currentProject: updatedProject,
                projects 
            })
        }
        
        return success
    },

    switchProject: (projectId) => {
        const project = StorageManager.getProject(projectId)
        
        if (!project) {
            console.warn(`Project ${projectId} not found`)
            return null
        }

        StorageManager.setLastProjectId(projectId)
        set({ currentProject: project })
        
        return project
    },

    deleteProject: (projectId) => {
        const { currentProject } = get()
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
                const newProject = get().createProject('默认项目', DEFAULT_COMPONENTS)
                set({ 
                    currentProject: newProject,
                    projects: [newProject]
                })
            }
        } else {
            set({ projects: updatedProjects })
        }
        
        return true
    },

    renameProject: (projectId, newName) => {
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
    },

    setCurrentProject: (project) => {
        set({ currentProject: project })
    }
}))
