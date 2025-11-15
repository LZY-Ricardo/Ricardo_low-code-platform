# Project Context

## Purpose
低代码编辑器平台 - 提供可视化拖拽搭建页面的能力，支持组件化开发和项目持久化。

## Tech Stack
- TypeScript
- React 19
- Vite
- Zustand (状态管理)
- Ant Design (UI组件库)
- TailwindCSS (样式)
- React DnD (拖拽)
- LocalStorage (持久化)

## Project Conventions

### Code Style
- 使用 TypeScript 严格模式
- ESLint + Prettier 格式化
- 组件使用函数式组件 + Hooks
- 状态管理使用 Zustand

### Architecture Patterns
- 组件化架构：物料区 + 画布区 + 属性区
- Store 分离：componentsStore（组件树）、projectStore（项目管理）
- 渲染模式：编辑模式 vs 预览模式

### Documentation Language
**重要约定：所有 OpenSpec 文档（proposal.md、tasks.md、spec.md、design.md）必须使用中文编写**
- Requirement 标题：使用中文
- Scenario 描述：使用中文
- 技术文档：使用中文
- 代码注释：使用中文

### Testing Strategy
- 手动测试为主
- 关键功能需测试边界情况

### Git Workflow
- 主分支：main
- 提交信息：中文描述 + Qoder 标识

## Domain Context
低代码平台核心概念：
- Component：组件对象，包含 id、name、props、styles、events、children
- ComponentConfig：组件配置注册表
- Material：物料，可拖拽的组件模板
- Project：项目，包含完整的组件树和元数据

## Important Constraints
- LocalStorage 容量限制（5-10MB）
- React 19 与部分库存在 peer dependency 警告
- 浏览器兼容性：现代浏览器

## External Dependencies
- 暂无外部 API 依赖
- 未来计划：后端用户系统（Phase 2）
