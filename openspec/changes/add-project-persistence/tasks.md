## 1. Phase 1: LocalStorage Implementation
- [x] 1.1 创建项目管理 Store (projectStore)
  - [x] 1.1.1 定义项目数据结构（id, name, components, createdAt, updatedAt）
  - [x] 1.1.2 实现项目 CRUD 方法（创建、读取、更新、删除）
  - [x] 1.1.3 实现当前项目状态管理
- [x] 1.2 创建 LocalStorage 工具模块
  - [x] 1.2.1 实现保存项目到 LocalStorage
  - [x] 1.2.2 实现从 LocalStorage 加载项目
  - [x] 1.2.3 实现获取所有项目列表
  - [x] 1.2.4 实现删除项目功能
- [x] 1.3 集成 componentsStore 与 projectStore
  - [x] 1.3.1 同步 components 变化到当前项目
  - [x] 1.3.2 切换项目时更新 componentsStore
- [x] 1.4 Header 组件增加项目管理 UI
  - [x] 1.4.1 添加保存按钮（手动保存）
  - [x] 1.4.2 添加项目选择下拉菜单
  - [x] 1.4.3 添加新建项目按钮
  - [x] 1.4.4 添加重命名项目功能
  - [x] 1.4.5 添加删除项目功能
- [x] 1.5 实现自动保存机制
  - [x] 1.5.1 监听 components 变化，防抖保存（3秒）
- [x] 1.6 应用启动时恢复上次项目
  - [x] 1.6.1 读取 lastOpenProjectId
  - [x] 1.6.2 加载对应项目数据到 componentsStore

## 2. Phase 2: Backend User System (Future)
- [ ] 2.1 后端 API 设计
  - [ ] 2.1.1 设计用户认证接口（注册/登录）
  - [ ] 2.1.2 设计项目管理 API
  - [ ] 2.1.3 选择数据库方案（MongoDB/MySQL）
- [ ] 2.2 前端集成后端 API
  - [ ] 2.2.1 实现用户登录/注册页面
  - [ ] 2.2.2 替换 LocalStorage 为 API 调用
  - [ ] 2.2.3 实现 LocalStorage 到云端的数据迁移
- [ ] 2.3 部署和测试
  - [ ] 2.3.1 后端服务部署
  - [ ] 2.3.2 前后端联调测试

## 3. Testing & Validation
- [x] 3.1 测试 LocalStorage 功能
  - [x] 3.1.1 测试保存/加载项目
  - [x] 3.1.2 测试多项目切换
  - [x] 3.1.3 测试自动保存
  - [x] 3.1.4 测试项目重命名/删除
  - [x] 3.1.5 测试浏览器刷新后数据恢复
- [x] 3.2 测试边界情况
  - [x] 3.2.1 测试 LocalStorage 容量限制处理
  - [x] 3.2.2 测试空项目处理
  - [x] 3.2.3 测试损坏数据容错处理
