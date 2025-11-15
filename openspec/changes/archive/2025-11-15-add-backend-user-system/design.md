## Context
本提案旨在为低代码平台添加完整的后端用户系统，解决当前 LocalStorage 存储方案的局限性。

**当前架构**（基于 `add-project-persistence` Phase 1）：
- 前端：React + Zustand
- 存储：LocalStorage（容量限制 5-10MB）
- 数据结构：`src/editor/stores/project.tsx`、`src/editor/utils/storage.ts`

**目标架构**：
- 前端：React + Zustand + React Router
- 后端：Node.js + Express/Nest.js
- 数据库：MongoDB/PostgreSQL
- 认证：JWT
- 存储：云端数据库 + LocalStorage 缓存

## Goals / Non-Goals

**Goals**：
- 实现用户注册、登录、认证系统
- 提供云端项目存储 API
- 支持 LocalStorage 项目迁移到云端
- 支持跨设备访问和数据同步
- 保证数据安全（加密、权限控制）

**Non-Goals**：
- ❌ 多人协作编辑（实时协同）
- ❌ 项目版本控制（Git 式版本管理）
- ❌ 社交功能（分享、评论）
- ❌ 第三方登录（OAuth）
- ❌ 项目模板市场

## Decisions

### Decision 1: 后端技术栈选型

**选择**：Node.js + Nest.js + PostgreSQL + Prisma

**理由**：
- **Nest.js**：TypeScript 原生支持，与前端技术栈一致，模块化架构清晰
- **PostgreSQL**：关系型数据库，数据一致性强，支持复杂查询
- **Prisma**：类型安全的 ORM，开发体验好，迁移工具完善

**Alternatives considered**：
- Express + MongoDB：更轻量，但缺乏类型安全和结构化
- Django/Flask (Python)：成熟但需要切换技术栈
- Supabase（BaaS）：快速但依赖第三方服务

### Decision 2: 认证方案

**选择**：JWT (JSON Web Token)

**理由**：
- 无状态，易于扩展
- 前后端分离友好
- 支持跨域

**实现细节**：
- Access Token：有效期 7 天
- 存储：LocalStorage（前端）
- 传输：Authorization: Bearer <token>

**Alternatives considered**：
- Session-Cookie：需要服务端状态管理
- OAuth2：过于复杂，不适合当前场景

### Decision 3: 数据迁移策略

**选择**：首次登录主动提示迁移

**流程**：
1. 用户首次登录后，检测 LocalStorage 中的 `lowcode_projects`
2. 弹窗提示："检测到 X 个本地项目，是否迁移到云端？"
3. 用户确认后，批量上传到后端（POST /api/projects/batch-import）
4. 迁移成功后，标记 `lowcode_migrated = true`

**Alternatives considered**：
- 自动静默迁移：可能导致意外数据覆盖
- 不提供迁移：用户体验差

### Decision 4: 离线支持

**选择**：保留 LocalStorage 作为离线缓存

**策略**：
- 在线模式：优先使用 API，同步更新 LocalStorage
- 离线模式：使用 LocalStorage，标记为"待同步"
- 重新联网：自动同步到云端（云端优先策略）

**理由**：
- 提升用户体验（网络不稳定时也能编辑）
- 平滑过渡（不强依赖后端）

## Risks / Trade-offs

### Risk 1: 数据同步冲突
**场景**：用户在设备 A 离线编辑，同时在设备 B 在线编辑同一项目

**缓解措施**：
- 使用 `updated_at` 时间戳检测冲突
- 云端优先策略（默认）
- 冲突提示："检测到云端有更新，是否覆盖本地修改？"

### Risk 2: 后端服务可用性
**场景**：后端宕机，用户无法访问项目

**缓解措施**：
- LocalStorage 缓存最近打开的项目
- 离线模式降级方案
- 监控和告警（Sentry）

### Risk 3: 安全性风险
**场景**：JWT 泄露、SQL 注入、暴力破解

**缓解措施**：
- JWT 短期有效（7 天）
- 使用 Prisma 参数化查询（防 SQL 注入）
- bcrypt 加密密码（至少 10 轮）
- 限流中间件（防暴力破解）
- HTTPS 强制

## Migration Plan

### 步骤 1: 后端开发（Week 1-2）
1. 初始化 Nest.js 项目
2. 配置 PostgreSQL + Prisma
3. 实现用户认证 API（注册/登录）
4. 实现项目 CRUD API
5. 编写单元测试

### 步骤 2: 前端集成（Week 3）
1. 安装 React Router
2. 创建登录/注册页面
3. 创建 authStore 和 API 客户端
4. 修改 projectStore 调用后端 API
5. 实现路由守卫

### 步骤 3: 数据迁移（Week 4）
1. 实现迁移检测逻辑
2. 实现批量上传 API
3. 用户测试和优化

### 步骤 4: 部署（Week 5）
1. 配置生产环境变量
2. 部署数据库（Supabase PostgreSQL / Railway）
3. 部署后端服务（Railway / Render）
4. 部署前端（Vercel / Netlify）
5. 联调测试

### 回滚方案
- 保留 LocalStorage 实现代码
- 通过环境变量 `VITE_USE_BACKEND=false` 回退到纯前端模式

## Open Questions
- [ ] 是否需要支持邮箱验证？（当前：不需要）
- [ ] 是否限制单用户项目数量？（当前：不限制）
- [ ] Token 刷新策略？（当前：7 天后重新登录）
- [ ] 是否支持找回密码？（可选功能）
