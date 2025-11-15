# API 接口文档

低代码平台后端 API 接口规范文档

版本：v1.0
基础路径：`/api/v1`

## 目录

- [认证接口](#认证接口)
- [项目管理接口](#项目管理接口)
- [数据模型](#数据模型)
- [错误码](#错误码)

---

## 认证接口

### 1. 用户注册

**POST** `/auth/register`

#### 请求参数

```json
{
  "username": "string (4-20字符，必填)",
  "email": "string (邮箱格式，必填)",
  "password": "string (至少8位，必填)"
}
```

#### 成功响应 (201)

```json
{
  "code": 0,
  "message": "注册成功",
  "data": {
    "userId": "string",
    "username": "string",
    "email": "string",
    "createdAt": "2025-11-15T08:00:00.000Z"
  }
}
```

#### 错误响应

| 状态码 | code | message |
|--------|------|---------|
| 400 | 1001 | 用户名已被使用 |
| 400 | 1002 | 邮箱格式不正确 |
| 400 | 1003 | 密码至少需要8位字符 |

---

### 2. 用户登录

**POST** `/auth/login`

#### 请求参数

```json
{
  "username": "string (必填)",
  "password": "string (必填)"
}
```

#### 成功响应 (200)

```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "accessToken": "string (JWT token)",
    "expiresIn": 604800,
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
}
```

#### 错误响应

| 状态码 | code | message |
|--------|------|---------|
| 401 | 1004 | 用户名或密码错误 |
| 400 | 1005 | 缺少必填字段 |

---

### 3. 验证 Token

**GET** `/auth/verify`

**需要认证：是**

#### 请求头

```
Authorization: Bearer <access_token>
```

#### 成功响应 (200)

```json
{
  "code": 0,
  "message": "Token 有效",
  "data": {
    "userId": "string",
    "username": "string",
    "email": "string"
  }
}
```

#### 错误响应

| 状态码 | code | message |
|--------|------|---------|
| 401 | 1006 | Token 无效或已过期 |
| 401 | 1007 | 缺少 Authorization 头 |

---

## 项目管理接口

### 4. 获取项目列表

**GET** `/projects`

**需要认证：是**

#### 查询参数

| 参数 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| page | number | 页码 | 1 |
| pageSize | number | 每页数量 (最大100) | 20 |
| sortBy | string | 排序字段 (updatedAt/createdAt) | updatedAt |
| order | string | 排序顺序 (asc/desc) | desc |

#### 成功响应 (200)

```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "projects": [
      {
        "id": "string",
        "name": "string",
        "components": [],
        "createdAt": "2025-11-15T08:00:00.000Z",
        "updatedAt": "2025-11-15T09:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 10,
      "page": 1,
      "pageSize": 20,
      "totalPages": 1
    }
  }
}
```

---

### 5. 获取单个项目

**GET** `/projects/:id`

**需要认证：是**

#### 路径参数

- `id`: 项目 ID (string)

#### 成功响应 (200)

```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "id": "string",
    "name": "string",
    "components": [
      {
        "id": "string",
        "type": "Button",
        "props": {},
        "styles": {},
        "events": [],
        "children": []
      }
    ],
    "createdAt": "2025-11-15T08:00:00.000Z",
    "updatedAt": "2025-11-15T09:00:00.000Z",
    "userId": "string"
  }
}
```

#### 错误响应

| 状态码 | code | message |
|--------|------|---------|
| 404 | 2001 | 项目不存在 |
| 403 | 2002 | 无权访问该项目 |

---

### 6. 创建项目

**POST** `/projects`

**需要认证：是**

#### 请求参数

```json
{
  "name": "string (必填，1-50字符)",
  "components": "array (可选，默认为[])"
}
```

#### 成功响应 (201)

```json
{
  "code": 0,
  "message": "创建成功",
  "data": {
    "id": "string",
    "name": "string",
    "components": [],
    "createdAt": "2025-11-15T08:00:00.000Z",
    "updatedAt": "2025-11-15T08:00:00.000Z",
    "userId": "string"
  }
}
```

#### 错误响应

| 状态码 | code | message |
|--------|------|---------|
| 400 | 2003 | 项目名称不能为空 |
| 400 | 2004 | 项目名称长度超出限制 |

---

### 7. 更新项目

**PUT** `/projects/:id`

**需要认证：是**

#### 路径参数

- `id`: 项目 ID (string)

#### 请求参数

```json
{
  "name": "string (可选)",
  "components": "array (可选)"
}
```

#### 成功响应 (200)

```json
{
  "code": 0,
  "message": "更新成功",
  "data": {
    "id": "string",
    "name": "string",
    "components": [],
    "updatedAt": "2025-11-15T10:00:00.000Z"
  }
}
```

#### 错误响应

| 状态码 | code | message |
|--------|------|---------|
| 404 | 2001 | 项目不存在 |
| 403 | 2002 | 无权修改该项目 |
| 400 | 2005 | 无效的更新数据 |

---

### 8. 删除项目

**DELETE** `/projects/:id`

**需要认证：是**

#### 路径参数

- `id`: 项目 ID (string)

#### 成功响应 (200)

```json
{
  "code": 0,
  "message": "删除成功",
  "data": {
    "id": "string"
  }
}
```

#### 错误响应

| 状态码 | code | message |
|--------|------|---------|
| 404 | 2001 | 项目不存在 |
| 403 | 2002 | 无权删除该项目 |

---

### 9. 批量导入项目 (数据迁移)

**POST** `/projects/batch-import`

**需要认证：是**

#### 请求参数

```json
{
  "projects": [
    {
      "name": "string",
      "components": "array",
      "createdAt": "string (可选)",
      "updatedAt": "string (可选)"
    }
  ]
}
```

#### 成功响应 (201)

```json
{
  "code": 0,
  "message": "批量导入成功",
  "data": {
    "imported": 5,
    "failed": 0,
    "projects": [
      {
        "id": "string",
        "name": "string"
      }
    ]
  }
}
```

#### 错误响应

| 状态码 | code | message |
|--------|------|---------|
| 400 | 2006 | 批量导入数据格式错误 |
| 400 | 2007 | 导入项目数量超过限制 (最多100个) |

---

## 数据模型

### User (用户)

```typescript
interface User {
  id: string;                 // 用户 ID (UUID)
  username: string;           // 用户名 (唯一)
  email: string;              // 邮箱 (唯一)
  password: string;           // 密码 (bcrypt 加密)
  createdAt: Date;            // 创建时间
  updatedAt: Date;            // 更新时间
}
```

### Project (项目)

```typescript
interface Project {
  id: string;                 // 项目 ID (UUID)
  name: string;               // 项目名称
  components: Component[];    // 组件树
  userId: string;             // 所属用户 ID (外键)
  createdAt: Date;            // 创建时间
  updatedAt: Date;            // 更新时间
}
```

### Component (组件)

```typescript
interface Component {
  id: string;                 // 组件 ID (前端生成)
  type: string;               // 组件类型 (Button/Input/Container等)
  props: Record<string, any>; // 属性配置
  styles: Record<string, any>;// 样式配置
  events: Event[];            // 事件配置
  children: Component[];      // 子组件
}
```

### Event (事件)

```typescript
interface Event {
  type: string;               // 事件类型 (click/change等)
  action: string;             // 动作类型 (navigate/alert等)
  params: Record<string, any>;// 参数
}
```

---

## 错误码

### 通用错误码

| code | message |
|------|---------|
| 0 | 成功 |
| 9999 | 服务器内部错误 |
| 9998 | 请求参数验证失败 |

### 认证相关 (1xxx)

| code | message |
|------|---------|
| 1001 | 用户名已被使用 |
| 1002 | 邮箱格式不正确 |
| 1003 | 密码至少需要8位字符 |
| 1004 | 用户名或密码错误 |
| 1005 | 缺少必填字段 |
| 1006 | Token 无效或已过期 |
| 1007 | 缺少 Authorization 头 |

### 项目相关 (2xxx)

| code | message |
|------|---------|
| 2001 | 项目不存在 |
| 2002 | 无权访问/修改/删除该项目 |
| 2003 | 项目名称不能为空 |
| 2004 | 项目名称长度超出限制 |
| 2005 | 无效的更新数据 |
| 2006 | 批量导入数据格式错误 |
| 2007 | 导入项目数量超过限制 |

---

## 认证机制

### JWT Token

- **算法**: HS256
- **有效期**: 7 天 (604800秒)
- **存储位置**: 前端 LocalStorage
- **传输方式**: HTTP Header `Authorization: Bearer <token>`

### Payload 结构

```json
{
  "userId": "string",
  "username": "string",
  "iat": 1700000000,
  "exp": 1700604800
}
```

### 认证流程

1. 用户登录成功后，后端返回 `accessToken`
2. 前端将 token 存储到 `localStorage.setItem('lowcode_token', token)`
3. 后续所有请求在请求头添加 `Authorization: Bearer ${token}`
4. 后端中间件验证 token 有效性，提取 `userId`
5. Token 过期返回 401，前端清除 token 并跳转登录页

---

## 安全性

### 密码安全

- 使用 bcrypt 加密，至少 10 轮 salt
- 密码最低要求：8 位字符
- 不得返回密码字段到前端

### SQL 注入防护

- 使用 Prisma ORM 参数化查询
- 禁止拼接 SQL 语句

### XSS 防护

- 所有用户输入经过 HTML 转义
- 设置 CSP (Content Security Policy) 头

### CORS 配置

```javascript
{
  origin: process.env.FRONTEND_URL,
  credentials: true
}
```

### 限流

- 登录接口：每 IP 每分钟最多 5 次请求
- API 接口：每用户每分钟最多 100 次请求

---

## 环境变量

后端需要配置以下环境变量：

```env
# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/lowcode_db

# JWT 密钥
JWT_SECRET=your-secret-key-here

# Token 有效期 (秒)
JWT_EXPIRES_IN=604800

# 服务器端口
PORT=3000

# 前端 URL (CORS)
FRONTEND_URL=http://localhost:5173

# bcrypt 加密轮数
BCRYPT_ROUNDS=10
```

---

## 版本历史

| 版本 | 日期 | 变更说明 |
|------|------|---------|
| v1.0 | 2025-11-15 | 初始版本，包含用户认证和项目管理基础功能 |
