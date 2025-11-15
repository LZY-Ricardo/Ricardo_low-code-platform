## 1. 后端 API 设计与开发
- [ ] 1.1 选择技术栈
  - [ ] 1.1.1 确定后端框架（Node.js + Express/Koa + Nest.js）
  - [ ] 1.1.2 选择数据库（MongoDB / MySQL / PostgreSQL）
  - [ ] 1.1.3 选择 ORM/ODM 工具（Prisma / TypeORM / Mongoose）
- [ ] 1.2 数据库设计
  - [ ] 1.2.1 设计用户表（id, username, email, password_hash, created_at）
  - [ ] 1.2.2 设计项目表（id, user_id, name, components, created_at, updated_at）
  - [ ] 1.2.3 编写数据库迁移脚本
- [ ] 1.3 用户认证系统
  - [ ] 1.3.1 实现用户注册 API（POST /api/auth/register）
  - [ ] 1.3.2 实现用户登录 API（POST /api/auth/login）
  - [ ] 1.3.3 实现 JWT 生成和验证中间件
  - [ ] 1.3.4 密码加密（bcrypt）
- [ ] 1.4 项目管理 API
  - [ ] 1.4.1 创建项目（POST /api/projects）
  - [ ] 1.4.2 获取项目列表（GET /api/projects）
  - [ ] 1.4.3 获取项目详情（GET /api/projects/:id）
  - [ ] 1.4.4 更新项目（PUT /api/projects/:id）
  - [ ] 1.4.5 删除项目（DELETE /api/projects/:id）
- [ ] 1.5 API 文档和测试
  - [ ] 1.5.1 编写 API 文档（Swagger/OpenAPI）
  - [ ] 1.5.2 单元测试和集成测试

## 2. 前端集成
- [ ] 2.1 路由和页面开发
  - [ ] 2.1.1 安装 React Router（react-router-dom）
  - [ ] 2.1.2 创建登录页面（/login）
  - [ ] 2.1.3 创建注册页面（/register）
  - [ ] 2.1.4 实现路由守卫（未登录重定向）
- [ ] 2.2 用户认证状态管理
  - [ ] 2.2.1 创建 authStore（用户信息、token、登录状态）
  - [ ] 2.2.2 实现登录逻辑（调用 API + 存储 token）
  - [ ] 2.2.3 实现退出登录
  - [ ] 2.2.4 token 持久化（LocalStorage）
  - [ ] 2.2.5 请求拦截器（自动添加 Authorization header）
- [ ] 2.3 API 调用层
  - [ ] 2.3.1 创建 HTTP 客户端（axios/fetch 封装）
  - [ ] 2.3.2 实现认证 API 调用
  - [ ] 2.3.3 实现项目 API 调用
  - [ ] 2.3.4 错误处理（401 重定向登录）
- [ ] 2.4 适配 projectStore
  - [ ] 2.4.1 修改 saveCurrentProject 调用后端 API
  - [ ] 2.4.2 修改 loadProjects 从 API 加载
  - [ ] 2.4.3 修改 createProject、deleteProject、renameProject
  - [ ] 2.4.4 保留 LocalStorage 作为离线缓存（可选）

## 3. 数据迁移
- [ ] 3.1 LocalStorage 迁移工具
  - [ ] 3.1.1 检测 LocalStorage 中的旧项目
  - [ ] 3.1.2 提示用户迁移到云端
  - [ ] 3.1.3 批量上传旧项目到后端
  - [ ] 3.1.4 迁移完成后清理 LocalStorage（可选）

## 4. 部署
- [ ] 4.1 后端部署
  - [ ] 4.1.1 配置生产环境变量（数据库连接、JWT secret）
  - [ ] 4.1.2 部署数据库（云数据库 / 自建）
  - [ ] 4.1.3 部署后端服务（Node.js 服务器）
  - [ ] 4.1.4 配置 HTTPS 和域名
- [ ] 4.2 前端部署
  - [ ] 4.2.1 配置 API 基础 URL（环境变量）
  - [ ] 4.2.2 构建和部署前端
- [ ] 4.3 联调测试
  - [ ] 4.3.1 测试注册登录流程
  - [ ] 4.3.2 测试项目 CRUD
  - [ ] 4.3.3 测试跨设备访问
  - [ ] 4.3.4 测试数据迁移

## 5. 测试与验证
- [ ] 5.1 功能测试
  - [ ] 5.1.1 用户注册和登录
  - [ ] 5.1.2 项目创建、编辑、保存
  - [ ] 5.1.3 多设备同步验证
- [ ] 5.2 安全测试
  - [ ] 5.2.1 SQL 注入防护
  - [ ] 5.2.2 XSS 防护
  - [ ] 5.2.3 CSRF 防护
  - [ ] 5.2.4 密码强度验证
- [ ] 5.3 性能测试
  - [ ] 5.3.1 大项目加载性能
  - [ ] 5.3.2 并发用户测试
