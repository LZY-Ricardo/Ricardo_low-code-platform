# 功能规范：路由系统

## 1. 路由结构

### Requirement 1.1: 定义应用路由层级

**场景**：应用需要支持多个页面和导航功能

**路由表**：

| 路径 | 组件 | 访问权限 | 说明 |
|------|------|---------|------|
| `/` | - | 公开 | 自动重定向到 `/projects` |
| `/login` | Login | 公开 | 登录页面 |
| `/register` | Register | 公开 | 注册页面 |
| `/projects` | Projects | 受保护 | 项目列表页 |
| `/editor/:projectId` | Editor | 受保护 | 编辑器页面 |
| `*` | NotFound | 公开 | 404 页面（可选） |

**示例配置**：
```typescript
// src/router/index.tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/projects" replace />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/projects',
    element: (
      <ProtectedRoute>
        <Projects />
      </ProtectedRoute>
    )
  },
  {
    path: '/editor/:projectId',
    element: (
      <ProtectedRoute>
        <Editor />
      </ProtectedRoute>
    )
  }
]);
```

---

## 2. 路由守卫

### Requirement 2.1: 未登录拦截

**场景**：未登录用户尝试访问受保护页面

**Given**: 用户未登录（authStore.isAuthenticated === false）  
**When**: 用户访问 `/projects` 或 `/editor/:projectId`  
**Then**: 
- 自动重定向到 `/login`
- URL 变更为 `/login`
- 页面渲染登录组件

**实现**：
```typescript
// src/router/ProtectedRoute.tsx
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

### Requirement 2.2: 已登录重定向

**场景**：已登录用户访问登录/注册页

**Given**: 用户已登录（authStore.isAuthenticated === true）  
**When**: 用户访问 `/login` 或 `/register`  
**Then**: 
- 自动重定向到 `/projects`
- 避免重复登录

**实现**：
```typescript
// src/pages/Login.tsx
const Login = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/projects', { replace: true });
    }
  }, [isAuthenticated]);
  
  // ... 登录表单
};
```

---

## 3. 路由参数

### Requirement 3.1: 编辑器页面支持项目 ID 参数

**场景**：用户从项目列表打开特定项目

**Given**: 用户在项目列表页  
**When**: 用户点击某个项目（如 ID 为 `project_123`）  
**Then**: 
- 跳转到 `/editor/project_123`
- 编辑器组件通过 `useParams()` 获取 `projectId`
- 根据 `projectId` 加载对应项目数据

**示例**：
```typescript
// src/editor/index.tsx
import { useParams } from 'react-router-dom';

const Editor = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { loadProject } = useProjectStore();
  
  useEffect(() => {
    if (projectId) {
      loadProject(projectId); // 加载项目数据
    }
  }, [projectId]);
  
  // ... 编辑器渲染
};
```

### Requirement 3.2: 无效项目 ID 处理

**场景**：用户访问不存在的项目

**Given**: 用户访问 `/editor/invalid_id`  
**When**: API 返回 404 Not Found  
**Then**: 
- 显示错误提示："项目不存在或已被删除"
- 提供"返回项目列表"按钮

---

## 4. 路由导航

### Requirement 4.1: 编程式导航

**场景**：登录成功后自动跳转到项目列表

**示例**：
```typescript
// src/pages/Login.tsx
const handleLogin = async () => {
  try {
    await authStore.login(username, password);
    navigate('/projects'); // 编程式导航
  } catch (error) {
    message.error('登录失败');
  }
};
```

### Requirement 4.2: 声明式导航

**场景**：页面中的链接跳转

**示例**：
```typescript
// src/pages/Login.tsx
<Link to="/register">还没有账号？立即注册</Link>

// src/pages/Register.tsx
<Link to="/login">已有账号？去登录</Link>
```

### Requirement 4.3: 返回导航

**场景**：从编辑器返回项目列表

**示例**：
```typescript
// src/editor/components/Header/index.tsx
<Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/projects')}>
  返回项目列表
</Button>
```

---

## 5. 路由状态管理

### Requirement 5.1: 保留编辑器状态（可选）

**场景**：用户在编辑器做了修改但未保存，切换路由时提示

**Given**: 用户在编辑器修改了组件但未保存  
**When**: 用户点击"返回项目列表"或浏览器后退按钮  
**Then**: 
- 弹窗提示："您有未保存的修改，确定离开吗？"
- 用户确认后离开，取消则留在当前页

**实现**：
```typescript
// src/editor/index.tsx
import { useBlocker } from 'react-router-dom';

const Editor = () => {
  const { hasUnsavedChanges } = useProjectStore();
  
  useBlocker(
    ({ currentLocation, nextLocation }) => {
      if (hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname) {
        return window.confirm('您有未保存的修改，确定离开吗？');
      }
      return false;
    }
  );
  
  // ... 编辑器逻辑
};
```

---

## 6. URL 更新

### Requirement 6.1: 浏览器历史记录管理

**场景**：用户通过浏览器前进/后退按钮导航

**Given**: 用户依次访问了 `/login` → `/projects` → `/editor/123`  
**When**: 用户点击浏览器后退按钮  
**Then**: 
- 返回到 `/projects`
- 再次后退返回到 `/login`（但因已登录会重定向到 `/projects`）

**注意**：使用 `replace` 避免不必要的历史记录
```typescript
// 重定向时使用 replace
<Navigate to="/projects" replace />
navigate('/projects', { replace: true });
```

---

## 7. 路由懒加载（性能优化）

### Requirement 7.1: 按需加载页面组件

**场景**：减少初始加载体积，提升首屏速度

**实现**：
```typescript
// src/router/index.tsx
import { lazy, Suspense } from 'react';

const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Projects = lazy(() => import('@/pages/Projects'));
const Editor = lazy(() => import('@/editor/index'));

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<Spin size="large" />}>
        <Login />
      </Suspense>
    )
  },
  // ... 其他路由
]);
```

---

## 8. 404 错误处理

### Requirement 8.1: 处理无效路由

**场景**：用户访问不存在的路径

**Given**: 用户访问 `/invalid-path`  
**When**: 路由匹配失败  
**Then**: 
- 显示 404 页面
- 提示"页面不存在"
- 提供"返回首页"按钮

**实现**：
```typescript
// src/router/index.tsx
{
  path: '*',
  element: <NotFound />
}

// src/pages/NotFound.tsx
const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-6xl font-bold">404</h1>
    <p className="text-xl mt-4">页面不存在</p>
    <Button type="primary" onClick={() => navigate('/projects')}>
      返回首页
    </Button>
  </div>
);
```

---

## 9. 路由元信息（可选）

### Requirement 9.1: 动态页面标题

**场景**：根据当前路由更新浏览器标题

**示例**：
```typescript
// src/hooks/usePageTitle.ts
const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} - 低代码编辑器`;
  }, [title]);
};

// src/pages/Login.tsx
usePageTitle('登录');

// src/pages/Projects.tsx
usePageTitle('我的项目');

// src/editor/index.tsx
usePageTitle('编辑器');
```

---

## 10. 非功能性需求

### 10.1 性能
- 路由切换响应时间 < 200ms
- 懒加载代码分割，减少首屏加载时间

### 10.2 可访问性
- 支持键盘导航（Tab 键）
- 支持屏幕阅读器（ARIA 标签）

### 10.3 浏览器兼容性
- 支持 Chrome、Edge、Firefox、Safari 最新版本
- 使用 HTML5 History API（不使用 hash 路由）

### 10.4 SEO（可选）
- 使用 `react-helmet` 动态设置页面 meta 信息
- 注意：单页应用 SEO 较弱，如需优化考虑 SSR
