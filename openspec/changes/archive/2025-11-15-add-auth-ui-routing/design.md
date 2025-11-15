# 设计文档：登录注册界面与路由系统

## Context
当前低代码编辑器是一个单页面应用（SPA），直接渲染编辑器组件。项目已有：
- 前端：React 19 + Zustand + Ant Design + TailwindCSS
- 状态管理：componentsStore、projectStore
- 后端：lowcode-backend（NestJS + JWT，已初始化）

目标：添加用户认证界面和路由系统，实现多页面导航和权限控制。

## Goals / Non-Goals

**Goals**：
- ✅ 实现 React Router v6 路由系统
- ✅ 创建登录、注册、项目列表页面
- ✅ 实现路由守卫（未登录拦截）
- ✅ 封装 API 客户端和认证逻辑
- ✅ 用户状态持久化（LocalStorage）
- ✅ 友好的用户体验（表单验证、错误提示）

**Non-Goals**：
- ❌ 后端 API 开发（假设已有）
- ❌ OAuth 第三方登录
- ❌ 邮箱验证功能
- ❌ 找回密码功能
- ❌ 响应式移动端适配（桌面优先）

## Decisions

### Decision 1: 路由库选择

**选择**：React Router v6

**理由**：
- React 官方推荐的路由解决方案
- v6 版本 API 简洁，支持嵌套路由
- 强大的路由守卫和数据加载能力
- 社区活跃，文档完善

**Alternatives considered**：
- TanStack Router：过于复杂，学习成本高
- Wouter：轻量但功能不足
- Next.js：需要改造为全栈框架

### Decision 2: HTTP 客户端选择

**选择**：Axios

**理由**：
- 支持请求/响应拦截器（自动添加 token）
- 自动 JSON 转换
- 错误处理统一
- 浏览器兼容性好

**配置示例**：
```typescript
// src/api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// 请求拦截器：自动添加 token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：401 自动跳转登录
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Alternatives considered**：
- Fetch API：需要手动处理拦截器逻辑
- TanStack Query：适合复杂场景，当前阶段不必要

### Decision 3: 认证状态管理

**选择**：Zustand + LocalStorage

**理由**：
- 项目已使用 Zustand，保持技术栈一致
- 轻量级，API 简洁
- 支持中间件（persist 持久化）

**State 设计**：
```typescript
// src/stores/auth.ts
interface AuthState {
  user: User | null;          // 当前用户信息
  token: string | null;       // JWT token
  isAuthenticated: boolean;   // 是否已登录
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;      // 页面加载时检查登录状态
}
```

**Alternatives considered**：
- Context API：性能较差，重渲染问题
- Redux：过于复杂，不必要

### Decision 4: 路由结构设计

**选择**：扁平化路由 + 嵌套布局

**路由表**：
```
/login              - 登录页（公开）
/register           - 注册页（公开）
/                   - 根路径重定向到 /projects
/projects           - 项目列表页（受保护）
/editor/:projectId  - 编辑器页（受保护）
```

**路由守卫策略**：
- 公开路由（login、register）：已登录自动跳转到 /projects
- 受保护路由（projects、editor）：未登录跳转到 /login

**实现方式**：
```typescript
// src/router/ProtectedRoute.tsx
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
```

### Decision 5: UI 设计规范

**选择**：基于 Ant Design 组件 + 自定义样式

**登录/注册页面布局**：
- 居中卡片式设计
- 表单使用 Ant Design Form 组件
- 表单验证规则：
  - 用户名：4-20 字符，字母/数字/下划线
  - 邮箱：标准邮箱格式
  - 密码：8-20 字符，包含字母和数字
  - 确认密码：与密码一致

**项目列表页**：
- 卡片网格布局（Grid）
- 每个项目卡片显示：项目名、缩略图、更新时间
- 操作按钮：打开、删除、重命名

**顶部导航栏**：
- Logo + 项目名称
- 右侧：用户头像 + 下拉菜单（退出登录）

## Risks / Trade-offs

### Risk 1: Token 过期处理

**场景**：用户打开编辑器一段时间后，token 过期，API 请求失败

**缓解措施**：
- 响应拦截器检测 401，自动跳转登录
- 提示用户："登录已过期，请重新登录"
- 未来优化：实现 token 自动刷新

### Risk 2: 路由切换时状态丢失

**场景**：用户在编辑器修改组件后，未保存就切换路由

**缓解措施**：
- 使用 `react-router` 的 `beforeunload` 事件监听
- 弹窗提示："您有未保存的修改，确定离开吗？"
- 自动保存功能（后续优化）

### Risk 3: LocalStorage 容量限制

**场景**：存储大量项目导致 LocalStorage 超限

**缓解措施**：
- 当前阶段：仅存储 token 和用户信息（<1KB）
- 项目数据通过 API 从云端加载
- 不在 LocalStorage 缓存项目列表

## Migration Plan

### 阶段 1: 安装依赖和基础配置（1 天）
1. 安装 `react-router-dom`、`axios`
2. 配置环境变量 `.env`（API 基础 URL）
3. 创建目录结构：`src/pages/`、`src/api/`、`src/router/`

### 阶段 2: 路由系统搭建（1 天）
1. 创建路由配置 `src/router/index.tsx`
2. 实现路由守卫 `ProtectedRoute.tsx`
3. 修改 `main.tsx` 包裹 `BrowserRouter`
4. 修改 `App.tsx` 为路由容器

### 阶段 3: API 客户端封装（1 天）
1. 创建 `src/api/client.ts`（Axios 实例 + 拦截器）
2. 创建 `src/api/auth.ts`（登录、注册接口）
3. 定义 TypeScript 类型 `src/types/api.ts`

### 阶段 4: 认证状态管理（1 天）
1. 创建 `src/stores/auth.ts`
2. 实现登录、注册、退出逻辑
3. 实现 token 持久化
4. 添加登录状态检查逻辑

### 阶段 5: 页面开发（2-3 天）
1. 创建登录页 `src/pages/Login.tsx`
2. 创建注册页 `src/pages/Register.tsx`
3. 创建项目列表页 `src/pages/Projects.tsx`（简单版本）
4. 创建布局组件 `src/components/Layout.tsx`（导航栏）
5. 修改编辑器为路由页面

### 阶段 6: 集成测试（1 天）
1. 测试登录/注册流程
2. 测试路由跳转和守卫
3. 测试 token 过期处理
4. 测试退出登录

### 回滚方案
如果遇到问题，可以快速回退：
1. 移除 React Router，恢复直接渲染编辑器
2. 移除 API 调用，保留 LocalStorage 本地存储
3. 使用 Git 回退到上一个稳定版本

## Open Questions
- [ ] 是否需要"记住我"功能？（延长 token 有效期）
- [ ] 是否需要用户头像上传？（当前：使用默认头像）
- [ ] 项目列表是否需要分页？（当前：一次性加载全部）
- [ ] 是否需要暗黑模式？（当前：浅色主题）
- [ ] 后端 API 地址配置方式？（建议：环境变量 `VITE_API_BASE_URL`）
