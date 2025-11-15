# Change: 添加登录注册界面与路由系统

## Why
当前低代码编辑器项目缺少用户认证机制和页面路由系统，存在以下问题：
- 无法区分不同用户，所有人共享同一个 LocalStorage
- 缺少登录/注册界面，无法进行用户身份验证
- 项目直接进入编辑器，无法实现权限控制
- 无路由系统，无法实现多页面导航（编辑器、登录、项目列表等）

需要添加完整的前端认证界面和路由系统，为后续云端持久化做准备。

## What Changes
- **路由系统**
  - 安装并配置 React Router v6
  - 设计路由结构：登录页、注册页、编辑器页、项目列表页
  - 实现路由守卫（未登录重定向到登录页）
  
- **用户界面**
  - 登录页面（/login）：用户名/邮箱 + 密码
  - 注册页面（/register）：用户名、邮箱、密码、确认密码
  - 项目列表页（/projects）：展示用户所有项目
  - 顶部导航栏：用户信息、退出登录
  
- **状态管理**
  - 创建 authStore：管理用户登录状态、用户信息、token
  - token 持久化到 LocalStorage
  - 实现登录、注册、退出逻辑
  
- **API 客户端**
  - 封装 HTTP 请求客户端（基于 fetch/axios）
  - 实现请求拦截器（自动添加 Authorization header）
  - 实现响应拦截器（401 自动跳转登录）
  - 定义 API 接口类型（TypeScript）

## Impact
- Affected specs: 
  - `user-auth`（新增）：用户认证功能规范
  - `routing-system`（新增）：路由系统规范
  
- Affected code:
  - `package.json` - 添加 react-router-dom、axios 依赖
  - `src/main.tsx` - 包裹 BrowserRouter
  - `src/App.tsx` - 改造为路由配置
  - `src/pages/Login.tsx` - 新增登录页
  - `src/pages/Register.tsx` - 新增注册页
  - `src/pages/Projects.tsx` - 新增项目列表页
  - `src/editor/index.tsx` - 改造为受保护的路由页面
  - `src/stores/auth.ts` - 新增认证状态管理
  - `src/api/client.ts` - 新增 HTTP 客户端
  - `src/api/auth.ts` - 新增认证 API
  - `src/components/Layout.tsx` - 新增布局组件（导航栏）
  - `src/router/index.tsx` - 新增路由配置
  - `src/router/ProtectedRoute.tsx` - 新增路由守卫

**依赖关系**：
- 依赖后端项目：`lowcode-backend`（已存在 NestJS + JWT 基础）
- 为后续提案铺垫：`add-backend-user-system`

**不包含在此提案中**：
- ❌ 后端 API 实现（假设后端已提供接口）
- ❌ LocalStorage 数据迁移到云端
- ❌ 离线模式支持
- ❌ 找回密码功能
