/**
 * LocalStorage 数据迁移工具
 */
import { StorageManager, type Project } from '../editor/utils/storage';
import * as projectsApi from '../api/projects';
import type { BatchImportRequest } from '../api/projects';

const MIGRATION_FLAG_KEY = 'lowcode_migrated';

/**
 * 检查是否已迁移
 */
export function isMigrated(): boolean {
  return localStorage.getItem(MIGRATION_FLAG_KEY) === 'true';
}

/**
 * 标记为已迁移
 */
export function markAsMigrated(): void {
  localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
}

/**
 * 检测是否有需要迁移的本地项目
 */
export function hasLocalProjects(): boolean {
  const projects = StorageManager.getAllProjects();
  return projects.length > 0;
}

/**
 * 获取本地项目数量
 */
export function getLocalProjectCount(): number {
  const projects = StorageManager.getAllProjects();
  return projects.length;
}

/**
 * 获取本地项目列表
 */
export function getLocalProjects(): Project[] {
  return StorageManager.getAllProjects();
}

/**
 * 批量导入本地项目到云端
 */
export async function migrateLocalProjects(): Promise<{
  success: boolean;
  imported: number;
  failed: number;
  error?: string;
}> {
  try {
    const localProjects = StorageManager.getAllProjects();
    
    if (localProjects.length === 0) {
      return {
        success: true,
        imported: 0,
        failed: 0,
      };
    }

    // 准备批量导入数据
    const importData: BatchImportRequest = {
      projects: localProjects.map(project => ({
        name: project.name,
        components: project.components,
      })),
    };

    // 调用批量导入 API
    const result = await projectsApi.batchImportProjects(importData);

    // 标记为已迁移
    if (result.imported > 0) {
      markAsMigrated();
    }

    return {
      success: true,
      imported: result.imported,
      failed: result.failed,
    };
  } catch (error) {
    console.error('Failed to migrate local projects:', error);
    return {
      success: false,
      imported: 0,
      failed: 0,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}

/**
 * 清除本地项目数据（迁移成功后可选择清除）
 */
export function clearLocalProjects(): void {
  StorageManager.clearAllProjects();
}

/**
 * 重置迁移标记（用于重新迁移）
 */
export function resetMigrationFlag(): void {
  localStorage.removeItem(MIGRATION_FLAG_KEY);
}
