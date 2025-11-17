# Change: 添加多格式导出功能

## Why（为什么需要这个功能）

当前低代码平台只能在编辑器内预览和编辑项目，用户无法将搭建好的页面导出为可用的格式。这导致：

1. **无法独立部署**：用户无法将页面部署到自己的服务器或托管平台
2. **无法二次开发**：无法在导出后进行深度定制和代码级优化
3. **无法分享演示**：无法生成独立的 HTML 文件用于快速分享
4. **无法版本控制**：无法将项目以代码形式纳入 Git 管理
5. **平台锁定风险**：用户的工作成果被锁定在平台内

添加多格式导出功能可以：
- ✅ 提升平台价值和用户满意度
- ✅ 支持多种使用场景（演示、部署、开发）
- ✅ 降低平台迁移成本，增强用户信心
- ✅ 符合低代码平台的标准功能集

## What Changes（变更内容）

### 整体功能

实现 **5 种导出格式** 的完整导出系统：

1. **JSON 配置导出** - 纯配置文件，便于备份和版本控制
2. **静态 HTML 导出** - 单文件网页，可直接在浏览器打开
3. **React 项目导出** - 完整的 React + Vite 项目源码（zip）
4. **Vue 项目导出** - 完整的 Vue 3 + Vite 项目源码（zip）
5. **代码片段导出** - JSX/Vue 组件代码，可复制使用

### 分阶段实现

#### Phase 1: 基础导出能力（核心优先）
- JSON 配置导出
- 静态 HTML 导出
- 导出 UI 界面和交互

#### Phase 2: 项目导出（主要价值）
- React 项目导出
- Vue 项目导出
- 代码生成引擎

#### Phase 3: 高级功能（锦上添花）
- 代码片段导出
- 导出预览功能
- 自定义配置选项

## Impact（影响范围）

### 新增模块
- `src/editor/utils/exporters/` - 导出引擎模块
  - `json-exporter.ts` - JSON 导出器
  - `html-exporter.ts` - HTML 导出器
  - `react-exporter.ts` - React 项目导出器
  - `vue-exporter.ts` - Vue 项目导出器
  - `snippet-exporter.ts` - 代码片段导出器
  - `base-exporter.ts` - 导出器基类
  - `code-generator.ts` - 代码生成工具
  - `template-manager.ts` - 模板管理器

### 新增组件
- `src/editor/components/ExportModal/` - 导出弹窗组件
  - `index.tsx` - 主弹窗
  - `FormatSelector.tsx` - 格式选择器
  - `OptionsPanel.tsx` - 配置选项面板
  - `PreviewPanel.tsx` - 预览面板

### 修改文件
- `src/editor/components/Header/index.tsx` - 添加导出按钮
- `package.json` - 新增依赖：`jszip`, `file-saver`, `prettier`

### 新增 Spec
- `specs/export-system/spec.md` - 导出系统规格说明

## Success Criteria（成功标准）

### 功能完整性
- [ ] 支持 5 种导出格式
- [ ] 每种格式导出的文件可以正常使用
- [ ] UI 交互流畅，操作简单明了

### 质量标准
- [ ] 导出的 HTML 文件可在所有现代浏览器中正常显示
- [ ] 导出的 React/Vue 项目可正常运行（npm install + npm run dev）
- [ ] 导出的代码符合 ESLint 规范，格式化良好
- [ ] 组件的样式、属性、事件完整保留

### 性能标准
- [ ] 小型项目（< 20 组件）导出时间 < 1 秒
- [ ] 中型项目（20-50 组件）导出时间 < 3 秒
- [ ] 大型项目（50-100 组件）导出时间 < 5 秒

### 用户体验
- [ ] 导出过程有明确的进度提示
- [ ] 支持导出前预览
- [ ] 导出失败有友好的错误提示
- [ ] 提供导出文件使用说明

## Risks & Mitigations（风险与缓解）

### 技术风险

**R1: 组件代码生成复杂度高**
- 风险：不同组件的 props、styles、events 映射到代码的逻辑复杂
- 缓解：
  - 使用模板引擎 + AST 生成
  - 为每种组件类型定义清晰的代码模板
  - 优先支持现有组件，新组件逐步补充

**R2: React/Vue 项目模板维护成本**
- 风险：需要维护完整的项目模板，包括配置文件、依赖等
- 缓解：
  - 使用固定版本的项目模板
  - 模板存储在 `templates/` 目录，便于更新
  - 提供模板版本号和更新日志

**R3: 导出文件体积过大**
- 风险：zip 文件可能超过 10MB，下载缓慢
- 缓解：
  - 不包含 node_modules
  - 压缩级别优化
  - 仅生成必要的文件

**R4: 浏览器兼容性问题**
- 风险：导出的 HTML 可能在旧浏览器中不兼容
- 缓解：
  - 使用标准 HTML5 + CSS3
  - 避免使用实验性特性
  - 提供浏览器兼容性说明

### 业务风险

**R5: 用户期望不一致**
- 风险：用户期望导出后完全一致，但可能有差异
- 缓解：
  - 在导出前明确说明限制和差异
  - 提供导出预览功能
  - 文档中详细说明每种格式的适用场景

**R6: 事件处理器导出问题**
- 风险：编辑器中的事件配置可能无法完整转换为代码
- 缓解：
  - Phase 1 仅支持简单事件（showMessage、goToUrl）
  - 复杂事件提供占位符 + TODO 注释
  - 文档中说明需要手动完善的部分

## Dependencies（依赖）

### 外部依赖
- `jszip: ^3.10.1` - 生成 zip 文件
- `file-saver: ^2.0.5` - 下载文件
- `prettier: ^3.4.2` - 代码格式化

### 内部依赖
- 依赖现有的 `componentConfigStore` - 组件配置信息
- 依赖现有的 `componentsStore` - 组件树数据
- 依赖现有的 `projectStore` - 项目元数据

## Timeline（时间规划）

### Phase 1: 基础导出能力（预计 1-2 天）
- Day 1: JSON + HTML 导出器实现
- Day 2: 导出 UI 组件开发

### Phase 2: 项目导出（预计 2-3 天）
- Day 3: 代码生成引擎 + React 导出器
- Day 4: Vue 导出器
- Day 5: 集成测试和优化

### Phase 3: 高级功能（预计 1 天）
- Day 6: 代码片段导出 + 预览功能

**总计：4-6 天**

## Alternatives Considered（备选方案）

### 方案 A: 仅支持 JSON + HTML
- 优点：实现简单，快速上线
- 缺点：无法满足二次开发需求
- 结论：❌ 不足以满足用户需求

### 方案 B: 仅支持 React 项目导出
- 优点：聚焦核心价值
- 缺点：限制用户技术栈选择
- 结论：❌ 不够灵活

### 方案 C: 在线部署集成（Vercel/Netlify）
- 优点：用户体验最佳
- 缺点：需要第三方 API，开发周期长
- 结论：✅ 作为 Phase 4 未来规划

### 方案 D: 多格式导出（选定方案）
- 优点：满足不同场景需求，灵活性高
- 缺点：开发工作量较大
- 结论：✅ 最符合产品定位

## Open Questions（待解决问题）

1. **Q1: 是否需要支持 TypeScript 类型导出？**
   - 当前方案：React/Vue 项目默认导出 TypeScript 版本
   - 待定：是否提供 JavaScript 版本选项

2. **Q2: 导出的项目使用哪个包管理器？**
   - 当前方案：package.json 中不指定，用户自行选择
   - 待定：是否提供 pnpm-lock.yaml / yarn.lock

3. **Q3: 是否支持自定义组件的导出？**
   - 当前方案：Phase 1 仅支持内置组件
   - 待定：Phase 4 考虑插件化支持

4. **Q4: 导出的样式方案？**
   - 当前方案：HTML 使用内联样式，React/Vue 使用 CSS-in-JS
   - 待定：是否支持 Tailwind/CSS Modules

---

**提案作者**: Claude Code
**创建日期**: 2025-11-17
**状态**: 📝 Draft
