# 功能规范：用户认证系统

## 1. 用户注册

### Requirement 1.1: 用户可以通过注册页面创建账户

**场景**：新用户访问系统时，需要先注册账户才能使用低代码编辑器

**Given**: 用户访问注册页面 `/register`  
**When**: 用户填写用户名、邮箱、密码、确认密码并点击"注册"  
**Then**: 
- 系统验证表单数据
- 调用后端 API `POST /api/auth/register`
- 注册成功后自动跳转到登录页，提示"注册成功，请登录"
- 注册失败显示错误信息（如"用户名已存在"）

**验证规则**：
- 用户名：4-20 字符，仅支持字母、数字、下划线
- 邮箱：符合标准邮箱格式（正则：`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`）
- 密码：8-20 字符，必须包含字母和数字
- 确认密码：必须与密码完全一致

**示例**：
```typescript
// 有效输入
{
  username: "zhangsan",
  email: "zhangsan@example.com",
  password: "abc12345",
  confirmPassword: "abc12345"
}

// 无效输入示例
{
  username: "zs",              // ❌ 少于 4 字符
  email: "invalid-email",      // ❌ 邮箱格式错误
  password: "12345678",        // ❌ 缺少字母
  confirmPassword: "abc123"    // ❌ 与密码不一致
}
```

---

## 2. 用户登录

### Requirement 2.1: 用户可以使用用户名或邮箱登录

**场景**：已注册用户需要登录后才能访问编辑器

**Given**: 用户访问登录页面 `/login`  
**When**: 用户输入用户名（或邮箱）和密码，点击"登录"  
**Then**: 
- 调用后端 API `POST /api/auth/login`
- 登录成功后：
  - 保存 JWT token 到 LocalStorage（key: `lowcode_token`）
  - 保存用户信息到 authStore
  - 自动跳转到项目列表页 `/projects`
- 登录失败显示错误信息（如"用户名或密码错误"）

**示例**：
```typescript
// API Request
POST /api/auth/login
{
  "username": "zhangsan",  // 或使用邮箱
  "password": "abc12345"
}

// API Response (成功)
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "username": "zhangsan",
    "email": "zhangsan@example.com"
  }
}

// API Response (失败)
{
  "statusCode": 401,
  "message": "用户名或密码错误"
}
```

### Requirement 2.2: 登录状态持久化

**场景**：用户登录后刷新页面或关闭浏览器重新打开，仍然保持登录状态

**Given**: 用户已登录并关闭浏览器  
**When**: 用户重新打开网站  
**Then**: 
- 从 LocalStorage 读取 token
- 验证 token 有效性（可选：调用 `GET /api/auth/me`）
- 自动恢复登录状态，无需重新登录

**实现细节**：
```typescript
// 应用启动时检查登录状态
useEffect(() => {
  const token = localStorage.getItem('lowcode_token');
  if (token) {
    authStore.checkAuth(); // 验证 token 并恢复用户信息
  }
}, []);
```

---

## 3. 路由守卫

### Requirement 3.1: 未登录用户无法访问受保护页面

**场景**：未登录用户尝试直接访问编辑器或项目列表页

**Given**: 用户未登录  
**When**: 用户访问 `/projects` 或 `/editor/:id`  
**Then**: 自动重定向到 `/login`，并显示提示"请先登录"

**示例**：
```typescript
// ProtectedRoute 实现
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

### Requirement 3.2: 已登录用户访问登录/注册页自动跳转

**场景**：已登录用户访问登录或注册页面

**Given**: 用户已登录  
**When**: 用户访问 `/login` 或 `/register`  
**Then**: 自动重定向到 `/projects`

---

## 4. 用户退出登录

### Requirement 4.1: 用户可以退出登录

**场景**：用户在编辑器或项目列表页点击"退出登录"

**Given**: 用户已登录并在任意受保护页面  
**When**: 用户点击导航栏的"退出登录"按钮  
**Then**: 
- 清除 LocalStorage 中的 token
- 清空 authStore 中的用户信息
- 跳转到登录页 `/login`

**示例**：
```typescript
const handleLogout = () => {
  localStorage.removeItem('lowcode_token');
  authStore.logout();
  navigate('/login');
};
```

---

## 5. Token 过期处理

### Requirement 5.1: Token 过期时自动跳转登录

**场景**：用户登录后长时间未操作，token 过期

**Given**: 用户已登录但 token 已过期  
**When**: 用户发起任何 API 请求  
**Then**: 
- 后端返回 401 Unauthorized
- 前端响应拦截器捕获 401 错误
- 清除 token 并跳转到登录页
- 显示提示"登录已过期，请重新登录"

**实现**：
```typescript
// Axios 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lowcode_token');
      authStore.logout();
      message.warning('登录已过期，请重新登录');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 6. API 接口定义

### 6.1 注册接口

**Endpoint**: `POST /api/auth/register`

**Request**:
```typescript
{
  "username": string,  // 4-20 字符
  "email": string,     // 有效邮箱格式
  "password": string   // 8-20 字符，字母+数字
}
```

**Response (成功 - 201)**:
```typescript
{
  "message": "注册成功"
}
```

**Response (失败 - 400/409)**:
```typescript
{
  "statusCode": 409,
  "message": "用户名已存在"
}
```

### 6.2 登录接口

**Endpoint**: `POST /api/auth/login`

**Request**:
```typescript
{
  "username": string,  // 用户名或邮箱
  "password": string
}
```

**Response (成功 - 200)**:
```typescript
{
  "token": string,
  "user": {
    "id": string,
    "username": string,
    "email": string,
    "createdAt": string
  }
}
```

**Response (失败 - 401)**:
```typescript
{
  "statusCode": 401,
  "message": "用户名或密码错误"
}
```

### 6.3 获取当前用户信息

**Endpoint**: `GET /api/auth/me`

**Headers**: `Authorization: Bearer <token>`

**Response (成功 - 200)**:
```typescript
{
  "id": string,
  "username": string,
  "email": string,
  "createdAt": string
}
```

**Response (失败 - 401)**:
```typescript
{
  "statusCode": 401,
  "message": "未授权"
}
```

---

## 7. 错误处理

### Requirement 7.1: 友好的错误提示

**场景**：API 请求失败时，向用户展示友好的错误信息

**错误类型映射**：
| HTTP 状态码 | 错误信息 |
|------------|---------|
| 400 | "请求参数错误，请检查输入" |
| 401 | "用户名或密码错误" |
| 403 | "无权访问该资源" |
| 409 | "用户名或邮箱已存在" |
| 500 | "服务器错误，请稍后重试" |
| 网络错误 | "网络连接失败，请检查网络" |

**示例**：
```typescript
try {
  await authStore.login(username, password);
} catch (error) {
  if (error.response?.status === 401) {
    message.error('用户名或密码错误');
  } else if (error.code === 'ERR_NETWORK') {
    message.error('网络连接失败，请检查网络');
  } else {
    message.error('登录失败，请稍后重试');
  }
}
```

---

## 8. 非功能性需求

### 8.1 安全性
- Token 仅存储在 LocalStorage，不暴露在 URL 或 Cookie
- 密码明文不在前端保存（仅传输时使用 HTTPS）
- API 请求统一通过 HTTPS 发送

### 8.2 性能
- 登录/注册接口响应时间 < 1 秒
- Token 验证无需额外 API 请求（JWT 本地验证）

### 8.3 可用性
- 表单验证实时反馈（输入时显示错误提示）
- 加载状态提示（登录/注册按钮 loading）
- 成功/失败提示使用 Ant Design Message 组件
