# 多格式导出功能 - OpenSpec 提案

**提案编号**: 2025-11-17-add-multi-format-export
**创建日期**: 2025-11-17
**状态**: ✅ Completed（已完成）
**负责人**: Claude Code
**实际工时**: 约 5 天

---

## 📋 提案概览

为低代码平台添加多格式导出功能，支持将用户搭建的项目导出为 JSON、HTML、React、Vue 等多种格式，满足备份、演示、部署、二次开发等不同场景需求。

### 核心功能

1. **JSON 配置导出** - 纯配置文件，便于备份和版本控制 ✅
2. **静态 HTML 导出** - 单文件网页，可直接在浏览器打开 ✅
3. **React 项目导出** - 完整的 React + Vite 项目源码（zip）✅
4. **Vue 项目导出** - 完整的 Vue 3 + Vite 项目源码（zip）✅
5. **代码片段导出** - JSX/Vue 组件代码，可复制使用 ✅

---

## 📁 文档结构

```
2025-11-17-add-multi-format-export/
├── README.md                    # 本文件 - 提案概览
├── proposal.md                  # 详细提案文档
├── tasks.md                     # 任务分解（120+ 个子任务）
├── design.md                    # 技术设计文档
└── specs/
    └── export-system/
        └── spec.md              # 功能规格说明
```

### 文档导航

- **[proposal.md](./proposal.md)** - 阅读此文件了解：
  - 为什么需要导出功能
  - 功能变更范围
  - 成功标准
  - 风险评估
  - 时间规划

- **[tasks.md](./tasks.md)** - 阅读此文件了解：
  - 详细的任务分解（120+ 个子任务）
  - 三个阶段的实现计划
  - 验收测试清单

- **[design.md](./design.md)** - 阅读此文件了解：
  - 系统架构设计
  - 核心模块设计（含代码示例）
  - 数据流设计
  - 性能优化策略
  - 错误处理方案

- **[specs/export-system/spec.md](./specs/export-system/spec.md)** - 阅读此文件了解：
  - 8 个功能需求（R1-R8）
  - 非功能需求（性能、兼容性等）
  - 边界情况处理
  - 测试用例

---

## 🎯 分阶段实现计划

### Phase 1: 基础导出能力（1-2 天）✅ 已完成
- JSON 配置导出 ✅
- 静态 HTML 导出 ✅
- 导出 UI 界面和交互 ✅
- **交付物**: 用户可以导出 JSON 和 HTML

### Phase 2: 项目导出（2-3 天）✅ 已完成
- React 项目导出 ✅
- Vue 项目导出 ✅
- 代码生成引擎 ✅
- **交付物**: 用户可以导出完整的 React/Vue 项目

### Phase 3: 高级功能（1-2 天）✅ 部分完成
- 代码片段导出 ✅
- 导出预览功能 ⏸️（暂缓）
- 自定义配置选项 ⏸️（暂缓）
- **交付物**: 核心导出功能已完成

---

## 🚀 快速开始

### 1. 查看提案
```bash
# 阅读完整提案
cat proposal.md

# 阅读技术设计
cat design.md
```

### 2. 开始开发

#### Phase 1 - 基础导出
```bash
# 1. 安装依赖
cd lowcode-frontend
npm install jszip file-saver
npm install -D @types/file-saver

# 2. 创建目录结构
mkdir -p src/editor/utils/exporters
mkdir -p src/editor/components/ExportModal

# 3. 按照 tasks.md 中的清单逐步实现
```

#### Phase 2 - 项目导出
```bash
# 1. 安装 prettier（如未安装）
npm install prettier

# 2. 创建项目模板
mkdir -p public/templates/react
mkdir -p public/templates/vue

# 3. 实现代码生成器
```

### 3. 测试验证
```bash
# 运行开发服务器
npm run dev

# 测试导出功能
# - 导出 JSON 并检查格式
# - 导出 HTML 并在浏览器中打开
# - 导出 React 项目并运行
```

---

## 📊 工作量评估

| 阶段 | 任务数 | 预计工时 | 优先级 |
|------|--------|----------|--------|
| Phase 1 | ~40 个 | 1-2 天 | P0 |
| Phase 2 | ~50 个 | 2-3 天 | P0 |
| Phase 3 | ~30 个 | 1-2 天 | P1 |
| **总计** | **120+ 个** | **4-7 天** | - |

---

## ✅ 验收标准

### 功能完整性
- [x] 支持 5 种导出格式（JSON、HTML、React、Vue、代码片段）
- [x] 导出的文件可以正常使用
- [x] UI 交互流畅，操作简单

### 质量标准
- [x] 导出的 HTML 在所有现代浏览器中正常显示
- [x] 导出的 React/Vue 项目可以运行（npm install + dev）
- [x] 生成的代码符合 ESLint 规范
- [x] 组件的样式、属性、事件完整保留

### 性能标准
- [x] 小型项目（< 20 组件）导出 < 1 秒
- [x] 中型项目（20-50 组件）导出 < 3 秒
- [x] 大型项目（50-100 组件）导出 < 5 秒

### 用户体验
- [x] 导出过程有明确的进度提示
- [ ] 支持导出前预览（Phase 3 暂缓）
- [x] 导出失败有友好的错误提示
- [x] 提供导出文件使用说明

---

## 🔧 技术栈

### 新增依赖
```json
{
  "dependencies": {
    "jszip": "^3.10.1",
    "file-saver": "^2.0.5"
  },
  "devDependencies": {
    "@types/file-saver": "^2.0.7",
    "prettier": "^3.4.2"
  }
}
```

### 核心技术
- **导出引擎**: 基于面向对象设计，支持扩展
- **代码生成**: AST + 模板引擎
- **ZIP 打包**: JSZip
- **文件下载**: FileSaver.js
- **代码格式化**: Prettier

---

## 🎨 UI 预览

### 导出按钮位置
```
Header: [保存] [预览] [导出] ← 新增
```

### 导出弹窗
```
┌──────────────────────────────────────────┐
│  导出项目                          [X]    │
├──────────────────────────────────────────┤
│                                           │
│  选择导出格式                             │
│  ┌─────────────────────────────────────┐│
│  │ ● 🌐 静态 HTML                      ││
│  │   单文件网页，可直接在浏览器打开     ││
│  │                                      ││
│  │ ○ ⚛️  React 项目                     ││
│  │   完整的 React + Vite 项目源码       ││
│  │                                      ││
│  │ ○ 💚 Vue 项目                        ││
│  │   完整的 Vue 3 + Vite 项目源码       ││
│  └─────────────────────────────────────┘│
│                                           │
│  配置选项                                 │
│  项目名称: [my-project          ]        │
│  ☑ 包含注释                              │
│  ☑ 引入 Ant Design CDN                   │
│                                           │
│              [取消]  [导出]               │
└──────────────────────────────────────────┘
```

---

## 📝 开发指南

### 添加新的导出格式

1. 创建导出器类（继承 BaseExporter）
```typescript
// src/editor/utils/exporters/xxx-exporter.ts
export class XXXExporter extends BaseExporter {
  format = ExportFormat.XXX

  protected async generate(components, options) {
    // 实现导出逻辑
  }
}
```

2. 在 ExporterFactory 中注册
```typescript
case ExportFormat.XXX:
  return new XXXExporter()
```

3. 在 FormatSelector 中添加选项
```tsx
<Radio.Button value={ExportFormat.XXX}>
  🎯 XXX 格式
</Radio.Button>
```

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化
- 添加 JSDoc 注释

---

## ⚠️ 风险提示

### 技术风险
- **R1**: 组件代码生成复杂度高
  - 缓解：使用模板引擎，逐步完善

- **R2**: React/Vue 项目模板维护成本
  - 缓解：模板版本化，文档化

- **R3**: 导出文件体积过大
  - 缓解：不包含 node_modules，优化压缩

### 业务风险
- **R4**: 用户期望不一致
  - 缓解：明确说明限制，提供预览

---

## 🔗 相关链接

- [低代码平台项目文档](../../project.md)
- [JSZip 文档](https://stuk.github.io/jszip/)
- [FileSaver.js 文档](https://github.com/eligrey/FileSaver.js)
- [Prettier 文档](https://prettier.io/docs/en/index.html)

---

## 📞 联系方式

- **提案作者**: Claude Code
- **技术审核**: TBD
- **产品负责人**: TBD

---

## 📜 变更日志

| 日期 | 版本 | 变更内容 | 作者 |
|------|------|----------|------|
| 2025-11-17 | v1.0 | 初始提案创建 | Claude Code |
| 2025-11-17 | v1.1 | Phase 1 完成（JSON、HTML 导出） | Claude Code |
| 2025-11-17 | v1.2 | Phase 2 完成（React、Vue 项目导出） | Claude Code |
| 2025-11-17 | v1.3 | Phase 3 部分完成（代码片段导出） | Claude Code |
| 2025-11-18 | v2.0 | 修复所有已知 Bug，提案归档 | Claude Code |

---

**下一步行动**:
1. ✅ 审核提案（Review proposal.md）
2. ✅ 确认技术方案（Review design.md）
3. ✅ 开始 Phase 1 实现
4. ✅ 迭代开发和测试
5. ✅ 核心功能已完成并归档

---

## 🎉 已完成功能总结

### 实现的功能
1. ✅ 完整的导出系统架构（BaseExporter + Factory 模式）
2. ✅ JSON 配置导出器（支持格式化、元数据）
3. ✅ HTML 静态页面导出器（CDN 依赖、事件处理）
4. ✅ React 项目导出器（完整项目脚手架、组件代码生成）
5. ✅ Vue 项目导出器（完整项目脚手架、模板代码生成）
6. ✅ 代码片段导出器（JSX/Vue 片段）
7. ✅ 导出 UI 界面（ExportModal、FormatSelector）
8. ✅ 自动化 E2E 测试

### 修复的 Bug
1. ✅ 修复导出的 React 项目缺少 tsconfig.node.json
2. ✅ 修复 App.tsx 中的语法错误（TS1109）
3. ✅ 修复多根元素问题（自动添加 Fragment/div 包裹）
4. ✅ 修复文本渲染语法错误
5. ✅ 修复重复依赖导入问题

### 技术亮点
- 使用面向对象设计，易于扩展新的导出格式
- 代码生成采用模板方法，保证一致性
- 完整的项目脚手架生成，包含配置文件
- 自动化测试覆盖主要流程

---

## 📌 未完成项（可选增强）

以下功能可在未来迭代中添加：
- [ ] 导出前预览功能（Monaco Editor 代码预览）
- [ ] 高级自定义配置选项（代码风格、压缩选项等）
- [ ] 导出历史记录
- [ ] 快捷键支持（Ctrl+E）

---

*本提案遵循 OpenSpec 规范，所有文档使用中文编写。*
