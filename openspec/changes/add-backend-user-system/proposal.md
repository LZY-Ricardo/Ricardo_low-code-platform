# Change: 添加后端用户系统 (Phase 2: 云端持久化)

## Why
当前项目仅支持 LocalStorage 本地存储，存在以下限制：
- 容量限制（5-10MB）
- 无法跨设备访问
- 无法多用户协作
- 数据仅存浏览器，清除缓存即丢失

需要实现后端用户系统，支持云端存储和多用户管理。

## What Changes
- **后端 API 开发**
  - 用户认证系统（注册、登录、JWT）
  - 项目管理 API（CRUD）
  - 数据库设计（用户表、项目表）
  
- **前端集成**
  - 用户登录/注册页面
  - 替换 LocalStorage 为 API 调用
  - LocalStorage 数据迁移工具
  - 离线模式支持（可选）

- **数据迁移**
  - 支持导入 LocalStorage 现有项目到云端
  - 平滑过渡方案

## Impact
- Affected specs: user-auth（新增）, project-management（扩展）
- Affected code:
  - 新增 `backend/` 目录（后端服务）
  - `src/editor/stores/project.tsx` - 适配 API 调用
  - `src/editor/utils/storage.ts` - 保留作为备用/迁移工具
  - `src/pages/Login.tsx` - 新增登录页
  - `src/pages/Register.tsx` - 新增注册页
  - `src/router/index.tsx` - 路由守卫

**依赖提案**：
- 基于 `add-project-persistence` (Phase 1: LocalStorage 持久化)
- 参考：`openspec/changes/archive/2025-11-15-add-project-persistence/`
