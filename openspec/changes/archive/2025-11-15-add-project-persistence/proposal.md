# Change: Add Project Persistence Feature (Phase 1: LocalStorage)

## Why
用户搭建的页面在刷新或关闭浏览器后会丢失，无法保存和恢复之前的工作成果。这严重影响了低代码平台的可用性，用户无法持续迭代开发项目。

## What Changes
- **Phase 1: LocalStorage 持久化**（本提案范围）
  - 实现基于 LocalStorage 的项目保存功能
  - 支持自动保存和手动保存
  - 支持项目列表管理（创建、打开、删除、重命名）
  - 页面加载时自动恢复上次编辑的项目

**注意**：Phase 2（后端用户系统）将在独立提案 `add-backend-user-system` 中实施。

## Impact
- Affected specs: project-management（新增功能）
- Affected code: 
  - `src/editor/stores/components.tsx` - 添加项目持久化逻辑
  - `src/editor/components/Header/index.tsx` - 添加保存/加载 UI
  - `src/editor/utils/storage.ts` - 新增存储工具模块
  - `src/editor/stores/project.tsx` - 新增项目管理 store
