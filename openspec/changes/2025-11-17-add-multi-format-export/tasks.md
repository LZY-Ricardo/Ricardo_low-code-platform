# Tasks: 多格式导出功能实现任务分解

## Phase 1: 基础导出能力（核心优先）

### 1.1 项目基础设置
- [ ] 1.1.1 安装依赖包
  - [ ] 安装 `jszip` - zip 文件生成
  - [ ] 安装 `file-saver` - 文件下载
  - [ ] 安装 `@types/file-saver` - TypeScript 类型定义
  - [ ] 验证依赖安装成功

### 1.2 创建导出系统基础架构
- [ ] 1.2.1 创建导出器目录结构
  - [ ] 创建 `src/editor/utils/exporters/` 目录
  - [ ] 创建 `src/editor/utils/exporters/types.ts` - 类型定义
  - [ ] 创建 `src/editor/utils/exporters/base-exporter.ts` - 基类
  - [ ] 创建 `src/editor/utils/exporters/index.ts` - 统一导出

- [ ] 1.2.2 定义导出类型和接口
  ```typescript
  // types.ts 需要包含：
  // - ExportFormat 枚举
  // - ExportOptions 接口
  // - ExportResult 接口
  // - BaseExporterInterface 接口
  ```

### 1.3 实现 JSON 导出器
- [ ] 1.3.1 创建 `json-exporter.ts`
- [ ] 1.3.2 实现组件树序列化
  - [ ] 处理循环引用
  - [ ] 格式化 JSON 输出（缩进 2 空格）
  - [ ] 添加元数据（版本、导出时间等）

- [ ] 1.3.3 实现下载功能
  - [ ] 使用 file-saver 下载 .json 文件
  - [ ] 文件命名：`{projectName}-config.json`

- [ ] 1.3.4 测试 JSON 导出
  - [ ] 测试简单组件树导出
  - [ ] 测试嵌套组件树导出
  - [ ] 测试特殊字符处理

### 1.4 实现静态 HTML 导出器
- [ ] 1.4.1 创建 `html-exporter.ts`
- [ ] 1.4.2 创建 HTML 模板
  - [ ] 基础 HTML5 结构
  - [ ] 引入必要的 CSS（Ant Design CDN）
  - [ ] 添加基础样式重置

- [ ] 1.4.3 实现组件树转 HTML
  - [ ] 递归遍历组件树
  - [ ] 将组件映射为 HTML 标签
  - [ ] 处理组件属性（props -> HTML attributes）
  - [ ] 处理内联样式（styles -> style attribute）

- [ ] 1.4.4 处理特殊组件
  - [ ] Button -> `<button>`
  - [ ] Input -> `<input>`
  - [ ] Container -> `<div>`
  - [ ] Text -> `<span>` 或 `<p>`
  - [ ] Title -> `<h1>` - `<h5>`
  - [ ] Image -> `<img>`
  - [ ] Card -> `<div class="card">`

- [ ] 1.4.5 添加交互脚本（可选）
  - [ ] 简单的 onClick 事件处理
  - [ ] showMessage 事件实现

- [ ] 1.4.6 实现下载功能
  - [ ] 生成完整 HTML 字符串
  - [ ] 使用 file-saver 下载 .html 文件
  - [ ] 文件命名：`{projectName}.html`

- [ ] 1.4.7 测试 HTML 导出
  - [ ] 在浏览器中打开测试样式
  - [ ] 测试响应式布局
  - [ ] 测试事件处理

### 1.5 创建导出 UI 组件
- [ ] 1.5.1 创建 ExportModal 组件目录
  - [ ] 创建 `src/editor/components/ExportModal/` 目录
  - [ ] 创建 `index.tsx` - 主弹窗组件
  - [ ] 创建 `FormatSelector.tsx` - 格式选择器
  - [ ] 创建 `styles.css` - 样式文件（如需要）

- [ ] 1.5.2 实现 ExportModal 主组件
  - [ ] 使用 Ant Design Modal 组件
  - [ ] 设计弹窗布局（格式选择 + 配置选项 + 操作按钮）
  - [ ] 实现打开/关闭逻辑
  - [ ] 添加导出中的 Loading 状态

- [ ] 1.5.3 实现 FormatSelector 格式选择器
  - [ ] 使用 Radio.Group 或 Card 选择格式
  - [ ] 显示格式图标和描述
  - [ ] JSON 格式：📄 "配置文件 - 用于备份和版本控制"
  - [ ] HTML 格式：🌐 "静态网页 - 可直接在浏览器打开"
  - [ ] React 格式：⚛️ "React 项目 - 完整源码（Phase 2）"
  - [ ] Vue 格式：💚 "Vue 项目 - 完整源码（Phase 2）"
  - [ ] 代码片段：📝 "代码片段 - JSX/Vue 组件代码（Phase 3）"

- [ ] 1.5.4 实现基础配置选项
  - [ ] 项目名称输入框（默认使用当前项目名）
  - [ ] 格式化选项（仅 JSON）
  - [ ] 包含注释选项

- [ ] 1.5.5 实现导出操作逻辑
  - [ ] 连接导出器（根据选择的格式调用对应导出器）
  - [ ] 显示导出进度
  - [ ] 成功后提示并关闭弹窗
  - [ ] 失败时显示错误信息

### 1.6 集成到 Header 组件
- [ ] 1.6.1 修改 `src/editor/components/Header/index.tsx`
  - [ ] 添加"导出"按钮（图标 + 文字）
  - [ ] 按钮位置：预览按钮旁边
  - [ ] 点击按钮打开 ExportModal

- [ ] 1.6.2 添加状态管理
  - [ ] 管理 ExportModal 的打开/关闭状态
  - [ ] 传递当前项目信息给 Modal

### 1.7 Phase 1 测试与优化
- [ ] 1.7.1 功能测试
  - [ ] 测试 JSON 导出完整性
  - [ ] 测试 HTML 导出在不同浏览器中的表现
  - [ ] 测试导出 UI 的交互流程

- [ ] 1.7.2 边界情况测试
  - [ ] 空项目导出
  - [ ] 超大项目（100+ 组件）导出
  - [ ] 特殊字符处理（中文、符号等）
  - [ ] 网络断开情况（仅前端，应正常工作）

- [ ] 1.7.3 用户体验优化
  - [ ] 添加导出成功提示（Message.success）
  - [ ] 优化 Loading 状态显示
  - [ ] 添加操作指引文案

---

## Phase 2: 项目导出（主要价值）

### 2.1 创建代码生成引擎
- [ ] 2.1.1 创建 `code-generator.ts`
  - [ ] 实现组件转 JSX 代码
  - [ ] 实现 props 转换
  - [ ] 实现 styles 转换
  - [ ] 实现事件处理器转换

- [ ] 2.1.2 创建组件代码模板
  - [ ] 为每种组件定义 JSX 模板
  - [ ] 支持属性插值
  - [ ] 支持子组件递归

- [ ] 2.1.3 实现代码格式化
  - [ ] 安装 `prettier`（如未安装）
  - [ ] 配置 Prettier 规则
  - [ ] 格式化生成的代码

### 2.2 创建项目模板管理器
- [ ] 2.2.1 创建 `template-manager.ts`
  - [ ] 定义模板接口
  - [ ] 实现模板读取逻辑

- [ ] 2.2.2 创建 React 项目模板
  - [ ] 在 `public/templates/react/` 创建模板文件
  - [ ] `package.json` - 依赖配置
  - [ ] `vite.config.ts` - Vite 配置
  - [ ] `tsconfig.json` - TypeScript 配置
  - [ ] `index.html` - 入口 HTML
  - [ ] `src/main.tsx` - 应用入口
  - [ ] `src/App.tsx` - 主组件模板
  - [ ] `README.md` - 使用说明
  - [ ] `.gitignore` - Git 忽略文件

- [ ] 2.2.3 创建 Vue 项目模板
  - [ ] 在 `public/templates/vue/` 创建模板文件
  - [ ] `package.json` - 依赖配置
  - [ ] `vite.config.ts` - Vite 配置
  - [ ] `tsconfig.json` - TypeScript 配置
  - [ ] `index.html` - 入口 HTML
  - [ ] `src/main.ts` - 应用入口
  - [ ] `src/App.vue` - 主组件模板
  - [ ] `README.md` - 使用说明
  - [ ] `.gitignore` - Git 忽略文件

### 2.3 实现 React 项目导出器
- [ ] 2.3.1 创建 `react-exporter.ts`

- [ ] 2.3.2 实现组件代码生成
  - [ ] 生成 App.tsx 主组件
  - [ ] 导入必要的依赖（React、Ant Design 组件）
  - [ ] 使用代码生成引擎转换组件树

- [ ] 2.3.3 实现项目文件组装
  - [ ] 读取 React 模板文件
  - [ ] 替换模板中的占位符（项目名、组件代码等）
  - [ ] 生成完整的文件结构

- [ ] 2.3.4 实现 ZIP 打包
  - [ ] 使用 JSZip 创建 zip 对象
  - [ ] 添加所有文件到 zip
  - [ ] 生成 zip blob
  - [ ] 使用 file-saver 下载
  - [ ] 文件命名：`{projectName}-react.zip`

- [ ] 2.3.5 测试 React 导出
  - [ ] 导出并解压 zip 文件
  - [ ] 运行 `npm install`
  - [ ] 运行 `npm run dev`
  - [ ] 验证页面渲染正确
  - [ ] 验证样式和事件

### 2.4 实现 Vue 项目导出器
- [ ] 2.4.1 创建 `vue-exporter.ts`

- [ ] 2.4.2 实现组件代码生成
  - [ ] 生成 App.vue 主组件
  - [ ] 使用 Vue 3 Composition API
  - [ ] 导入必要的依赖
  - [ ] 转换组件树为 Vue 模板语法

- [ ] 2.4.3 实现项目文件组装
  - [ ] 读取 Vue 模板文件
  - [ ] 替换模板占位符
  - [ ] 生成完整文件结构

- [ ] 2.4.4 实现 ZIP 打包
  - [ ] 使用 JSZip 打包
  - [ ] 下载 zip 文件
  - [ ] 文件命名：`{projectName}-vue.zip`

- [ ] 2.4.5 测试 Vue 导出
  - [ ] 导出并解压
  - [ ] 运行 `npm install`
  - [ ] 运行 `npm run dev`
  - [ ] 验证渲染和功能

### 2.5 更新导出 UI
- [ ] 2.5.1 启用 React 和 Vue 格式选项
  - [ ] 移除 "Phase 2" 标记
  - [ ] 添加详细说明文案

- [ ] 2.5.2 添加项目导出特有配置
  - [ ] 包管理器选择（npm/pnpm/yarn）- 可选
  - [ ] 是否包含 TypeScript
  - [ ] 是否包含 README 使用说明

### 2.6 Phase 2 测试与优化
- [ ] 2.6.1 功能测试
  - [ ] 测试 React 项目导出完整性
  - [ ] 测试 Vue 项目导出完整性
  - [ ] 测试复杂组件树导出

- [ ] 2.6.2 兼容性测试
  - [ ] 测试不同组件类型的代码生成
  - [ ] 测试嵌套组件的代码生成
  - [ ] 测试事件处理器的代码生成

- [ ] 2.6.3 性能优化
  - [ ] 优化大项目打包速度
  - [ ] 优化 zip 文件体积
  - [ ] 添加导出进度条

---

## Phase 3: 高级功能（锦上添花）

### 3.1 实现代码片段导出器
- [ ] 3.1.1 创建 `snippet-exporter.ts`

- [ ] 3.1.2 实现 JSX 代码片段生成
  - [ ] 生成单个组件的 JSX 代码
  - [ ] 包含必要的 import 语句
  - [ ] 格式化代码

- [ ] 3.1.3 实现 Vue 代码片段生成
  - [ ] 生成 Vue 单文件组件代码
  - [ ] 包含 template、script、style 部分

- [ ] 3.1.4 实现代码复制功能
  - [ ] 使用 Clipboard API
  - [ ] 复制成功提示
  - [ ] 降级方案（手动复制）

### 3.2 实现导出预览功能
- [ ] 3.2.1 在 ExportModal 中添加 PreviewPanel 组件
  - [ ] 创建 `PreviewPanel.tsx`
  - [ ] 使用 Monaco Editor 显示代码预览
  - [ ] 或使用 `<pre>` 标签 + 语法高亮

- [ ] 3.2.2 实现预览逻辑
  - [ ] 根据选择的格式生成预览内容
  - [ ] JSON：显示格式化的 JSON
  - [ ] HTML：显示 HTML 源码
  - [ ] React/Vue：显示主组件代码
  - [ ] 代码片段：显示生成的片段

- [ ] 3.2.3 添加预览开关
  - [ ] 默认折叠预览面板
  - [ ] 点击"预览"按钮展开
  - [ ] 支持全屏预览

### 3.3 添加自定义配置选项
- [ ] 3.3.1 创建 `OptionsPanel.tsx` 组件

- [ ] 3.3.2 实现通用配置项
  - [ ] 项目名称
  - [ ] 包含注释
  - [ ] 代码风格（2 空格/4 空格/Tab）

- [ ] 3.3.3 实现 HTML 特有配置
  - [ ] 是否压缩 HTML
  - [ ] 是否内联 CSS
  - [ ] 是否包含 Ant Design CDN

- [ ] 3.3.4 实现项目导出特有配置
  - [ ] 包管理器选择
  - [ ] 是否包含 ESLint 配置
  - [ ] 是否包含 Prettier 配置

- [ ] 3.3.5 持久化配置
  - [ ] 保存用户选择到 LocalStorage
  - [ ] 下次打开时恢复配置

### 3.4 优化用户体验
- [ ] 3.4.1 添加使用指南
  - [ ] 在 Modal 中添加"使用说明"Tab
  - [ ] 说明每种格式的适用场景
  - [ ] 提供快速开始示例

- [ ] 3.4.2 添加导出历史
  - [ ] 记录最近 5 次导出
  - [ ] 显示导出时间、格式、文件名
  - [ ] 支持重新导出

- [ ] 3.4.3 添加快捷操作
  - [ ] 支持键盘快捷键（Ctrl+E 打开导出）
  - [ ] 支持右键菜单快速导出
  - [ ] 支持拖拽导出（实验性）

### 3.5 Phase 3 测试与优化
- [ ] 3.5.1 功能测试
  - [ ] 测试代码片段导出
  - [ ] 测试预览功能
  - [ ] 测试自定义配置

- [ ] 3.5.2 用户体验测试
  - [ ] 测试整体流程的流畅性
  - [ ] 测试操作的便捷性
  - [ ] 收集用户反馈

- [ ] 3.5.3 性能优化
  - [ ] 优化预览加载速度
  - [ ] 优化大文件复制性能

- [ ] 3.5.4 文档完善
  - [ ] 编写完整的用户文档
  - [ ] 添加示例和截图
  - [ ] 提供常见问题解答

---

## 验收测试清单

### 基础功能验收
- [ ] ✅ JSON 导出可用，文件可重新导入
- [ ] ✅ HTML 导出可在浏览器中正常打开
- [ ] ✅ React 项目导出后可运行（npm install + dev）
- [ ] ✅ Vue 项目导出后可运行
- [ ] ✅ 代码片段可复制使用

### 质量验收
- [ ] ✅ 所有导出的代码通过 ESLint 检查
- [ ] ✅ 生成的代码格式化良好
- [ ] ✅ 样式完整保留
- [ ] ✅ 事件处理器正常工作
- [ ] ✅ 嵌套组件结构正确

### 性能验收
- [ ] ✅ 小项目导出 < 1 秒
- [ ] ✅ 中项目导出 < 3 秒
- [ ] ✅ 大项目导出 < 5 秒
- [ ] ✅ zip 文件体积合理（< 5MB）

### 用户体验验收
- [ ] ✅ UI 交互直观易用
- [ ] ✅ 错误提示清晰友好
- [ ] ✅ 成功提示明确
- [ ] ✅ 有操作指引文档

---

**任务总数**: 约 120+ 个子任务
**预计工时**:
- Phase 1: 1-2 天
- Phase 2: 2-3 天
- Phase 3: 1-2 天
- **总计: 4-7 天**
