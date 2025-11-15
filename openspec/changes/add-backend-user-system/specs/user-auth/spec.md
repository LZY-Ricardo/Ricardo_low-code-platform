## ADDED Requirements

### Requirement: 用户注册
系统 SHALL 支持新用户注册功能。

#### Scenario: 用户成功注册
- **WHEN** 用户填写有效的用户名、邮箱和密码
- **THEN** 系统应创建新用户账户
- **AND** 密码应使用 bcrypt 加密存储
- **AND** 返回成功消息并引导用户登录

#### Scenario: 用户名已存在
- **WHEN** 用户使用已存在的用户名注册
- **THEN** 系统应返回错误提示"用户名已被使用"
- **AND** 不应创建新账户

#### Scenario: 邮箱格式无效
- **WHEN** 用户输入无效的邮箱格式
- **THEN** 系统应返回错误提示"邮箱格式不正确"

#### Scenario: 密码强度不足
- **WHEN** 用户输入弱密码（少于8位）
- **THEN** 系统应返回错误提示"密码至少需要8位字符"

### Requirement: 用户登录
系统 SHALL 支持用户登录和身份认证。

#### Scenario: 用户成功登录
- **WHEN** 用户输入正确的用户名和密码
- **THEN** 系统应验证凭据
- **AND** 返回 JWT token
- **AND** 前端应存储 token 到 LocalStorage
- **AND** 重定向到编辑器页面

#### Scenario: 登录凭据错误
- **WHEN** 用户输入错误的用户名或密码
- **THEN** 系统应返回错误提示"用户名或密码错误"
- **AND** 不应返回 token

#### Scenario: Token 自动认证
- **WHEN** 用户刷新页面且存在有效 token
- **THEN** 系统应自动验证 token
- **AND** 保持登录状态
- **AND** 直接进入编辑器

#### Scenario: Token 过期处理
- **WHEN** 用户的 token 已过期
- **THEN** API 请求应返回 401 状态码
- **AND** 前端应清除 token
- **AND** 重定向到登录页面

### Requirement: 云端项目管理
系统 SHALL 支持用户在云端创建、读取、更新和删除项目。

#### Scenario: 创建云端项目
- **WHEN** 登录用户创建新项目
- **THEN** 项目应保存到后端数据库
- **AND** 关联到当前用户 ID
- **AND** 返回项目 ID 和元数据

#### Scenario: 获取用户项目列表
- **WHEN** 登录用户请求项目列表
- **THEN** 系统应返回该用户的所有项目
- **AND** 不应返回其他用户的项目
- **AND** 按更新时间倒序排列

#### Scenario: 更新云端项目
- **WHEN** 用户修改项目内容并保存
- **THEN** 系统应更新数据库中的项目数据
- **AND** 更新 updated_at 时间戳
- **AND** 返回更新成功状态

#### Scenario: 删除云端项目
- **WHEN** 用户删除项目
- **THEN** 系统应从数据库中删除该项目
- **AND** 验证用户是项目所有者
- **AND** 返回删除成功状态

#### Scenario: 未授权访问项目
- **WHEN** 用户尝试访问不属于自己的项目
- **THEN** 系统应返回 403 Forbidden 错误
- **AND** 不应返回项目数据

### Requirement: LocalStorage 数据迁移
系统 SHALL 支持将 LocalStorage 中的旧项目迁移到云端。

#### Scenario: 检测到旧项目数据
- **WHEN** 用户首次登录且 LocalStorage 中存在旧项目
- **THEN** 系统应显示迁移提示弹窗
- **AND** 列出待迁移的项目数量

#### Scenario: 用户确认迁移
- **WHEN** 用户点击"迁移到云端"按钮
- **THEN** 系统应批量上传 LocalStorage 项目到后端
- **AND** 显示迁移进度
- **AND** 迁移完成后提示成功

#### Scenario: 用户跳过迁移
- **WHEN** 用户选择"稍后迁移"
- **THEN** 系统应保留 LocalStorage 数据
- **AND** 下次登录继续提示

#### Scenario: 迁移失败处理
- **WHEN** 迁移过程中发生网络错误
- **THEN** 系统应保留 LocalStorage 数据
- **AND** 显示错误提示
- **AND** 允许用户重试

### Requirement: API 安全性
系统 SHALL 实现安全的 API 访问控制。

#### Scenario: 请求需要认证
- **WHEN** 用户访问受保护的 API 端点
- **THEN** 系统应验证 Authorization header 中的 JWT
- **AND** 未提供 token 时返回 401 错误

#### Scenario: SQL 注入防护
- **WHEN** 用户输入包含 SQL 特殊字符
- **THEN** 系统应使用参数化查询
- **AND** 不应执行恶意 SQL 代码

#### Scenario: 密码安全存储
- **WHEN** 用户注册或修改密码
- **THEN** 系统应使用 bcrypt 加密（至少 10 轮）
- **AND** 不应明文存储密码

## MODIFIED Requirements

### Requirement: 项目持久化
系统 SHALL 支持项目的本地和云端双重持久化（扩展自 `add-project-persistence`）。

**变更说明**：原 LocalStorage 持久化功能保留作为离线缓存，新增云端 API 持久化作为主存储方式。

#### Scenario: 在线保存项目
- **WHEN** 用户在线编辑项目并保存
- **THEN** 项目应保存到后端数据库
- **AND** 同步更新本地 LocalStorage 缓存

#### Scenario: 离线编辑项目
- **WHEN** 用户离线状态下编辑项目
- **THEN** 项目应暂存到 LocalStorage
- **AND** 显示"离线模式"提示

#### Scenario: 离线数据同步
- **WHEN** 用户重新联网
- **THEN** 系统应自动同步离线修改到云端
- **AND** 解决冲突（云端优先 / 本地优先 / 手动合并）

#### Scenario: 跨设备访问
- **WHEN** 用户在不同设备登录同一账户
- **THEN** 系统应加载云端最新项目数据
- **AND** 所有设备保持数据同步
