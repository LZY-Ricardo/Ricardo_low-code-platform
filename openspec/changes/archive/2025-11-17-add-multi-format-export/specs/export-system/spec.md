# Spec: 导出系统功能规格说明

## 功能概述

导出系统允许用户将在低代码平台中搭建的项目导出为多种格式，包括配置文件、静态网页、完整项目源码等，满足不同场景下的使用需求。

---

## 需求列表

### R1: JSON 配置导出

**优先级**: P0（必须实现）
**负责人**: TBD
**预计工时**: 0.5 天

#### 需求描述
用户可以将当前项目的组件树导出为 JSON 配置文件，用于备份、版本控制或迁移。

#### 验收标准
- [ ] 导出的 JSON 文件包含完整的组件树数据
- [ ] JSON 格式化良好，可读性强（2 空格缩进）
- [ ] 包含元数据：项目名称、版本、导出时间、生成器信息
- [ ] 导出的 JSON 可以重新导入到平台中（可选，Phase 4）
- [ ] 文件命名格式：`{projectName}-config.json`

#### 场景示例

**场景 1: 用户导出项目配置**
- Given: 用户在编辑器中搭建了一个包含 10 个组件的页面
- When: 用户点击"导出"按钮，选择"JSON 配置"格式
- Then: 浏览器下载一个 JSON 文件，包含完整的组件树和元数据

**场景 2: 导出空项目**
- Given: 用户创建了一个新项目，只有默认的 Page 组件
- When: 用户导出 JSON 配置
- Then: 导出成功，JSON 中只包含 Page 组件

#### 技术细节
```typescript
// 导出的 JSON 格式示例
{
  "meta": {
    "name": "my-project",
    "version": "1.0.0",
    "exportTime": "2025-11-17T10:30:00.000Z",
    "generator": "LowCode Platform"
  },
  "components": [
    {
      "id": 1,
      "name": "Page",
      "props": {},
      "desc": "页面",
      "children": [
        {
          "id": 2,
          "name": "Container",
          "props": {},
          "styles": { "padding": "20px" },
          "parentId": 1,
          "children": [...]
        }
      ]
    }
  ]
}
```

---

### R2: 静态 HTML 导出

**优先级**: P0（必须实现）
**负责人**: TBD
**预计工时**: 1 天

#### 需求描述
用户可以将当前项目导出为单个静态 HTML 文件，可以直接在浏览器中打开使用，无需任何运行环境。

#### 验收标准
- [ ] 导出的 HTML 文件可在所有现代浏览器中正常打开
- [ ] 页面样式与编辑器预览保持一致
- [ ] 包含必要的 CSS（Ant Design CDN 或内联样式）
- [ ] 支持基础交互（onClick 事件等）
- [ ] 文件命名格式：`{projectName}.html`
- [ ] HTML 结构规范，符合 HTML5 标准

#### 场景示例

**场景 1: 导出简单页面用于演示**
- Given: 用户搭建了一个包含标题、按钮、文本的简单页面
- When: 用户导出为 HTML 格式
- Then: 下载的 HTML 文件可以直接发送给客户预览

**场景 2: 导出复杂布局页面**
- Given: 用户搭建了包含嵌套容器、多层布局的复杂页面
- When: 用户导出为 HTML
- Then: HTML 文件正确渲染所有嵌套结构和样式

#### 技术细节

**组件映射规则**:
```
Page -> <div class="page">
Container -> <div class="container">
Button -> <button class="btn-{type}">
Input -> <input type="text">
Text -> <span> 或 <p>
Title -> <h1> ~ <h5>（根据 level）
Image -> <img>
Card -> <div class="card">
```

**事件处理**:
- onClick -> 转换为 onclick 属性
- showMessage -> alert() 或自定义提示
- goToUrl -> window.location.href

**样式处理**:
- 组件 styles 转换为内联 style 属性
- 全局样式通过 `<style>` 标签嵌入
- 可选引入 Ant Design CDN

---

### R3: React 项目导出

**优先级**: P0（必须实现）
**负责人**: TBD
**预计工时**: 1.5 天

#### 需求描述
用户可以将项目导出为完整的 React + Vite + TypeScript 项目源码（ZIP 格式），可以直接运行和二次开发。

#### 验收标准
- [ ] 导出的 ZIP 包含完整的 React 项目结构
- [ ] 解压后可以运行 `npm install` 安装依赖
- [ ] 运行 `npm run dev` 可以启动开发服务器
- [ ] 页面渲染效果与编辑器预览一致
- [ ] 生成的代码符合 ESLint 规范
- [ ] 代码格式化良好（使用 Prettier）
- [ ] 文件命名格式：`{projectName}-react.zip`

#### 场景示例

**场景 1: 导出项目用于二次开发**
- Given: 用户搭建了一个数据展示页面
- When: 用户导出为 React 项目
- Then: 开发人员可以在导出的项目中添加 API 调用、状态管理等

**场景 2: 导出项目用于部署**
- Given: 用户完成了一个营销落地页
- When: 用户导出为 React 项目并运行 `npm run build`
- Then: 生成的 dist 目录可以部署到任何静态托管平台

#### 技术细节

**项目结构**:
```
project-react/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── index.html
├── .gitignore
├── README.md
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   └── vite-env.d.ts
```

**依赖清单**:
```json
{
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "antd": "^5.26.5"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.6.0",
    "typescript": "~5.8.3",
    "vite": "^7.0.4"
  }
}
```

**代码生成示例**:
```tsx
// src/App.tsx
import React from 'react'
import { Button, Input, Card } from 'antd'

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <Card title="欢迎">
        <Input placeholder="请输入内容" style={{ marginBottom: '10px' }} />
        <Button type="primary">提交</Button>
      </Card>
    </div>
  )
}

export default App
```

---

### R4: Vue 项目导出

**优先级**: P1（重要）
**负责人**: TBD
**预计工时**: 1.5 天

#### 需求描述
用户可以将项目导出为完整的 Vue 3 + Vite + TypeScript 项目源码（ZIP 格式）。

#### 验收标准
- [ ] 导出的 ZIP 包含完整的 Vue 项目结构
- [ ] 使用 Vue 3 Composition API
- [ ] 运行 `npm install && npm run dev` 可以启动
- [ ] 页面渲染效果正确
- [ ] 代码格式化良好
- [ ] 文件命名格式：`{projectName}-vue.zip`

#### 场景示例

**场景 1: 导出 Vue 项目**
- Given: 用户偏好使用 Vue 技术栈
- When: 用户导出为 Vue 项目
- Then: 获得可运行的 Vue 3 项目

#### 技术细节

**项目结构**:
```
project-vue/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── .gitignore
├── README.md
├── src/
│   ├── main.ts
│   ├── App.vue
│   └── vite-env.d.ts
```

**代码生成示例**:
```vue
<!-- src/App.vue -->
<template>
  <div style="padding: 20px">
    <a-card title="欢迎">
      <a-input placeholder="请输入内容" style="margin-bottom: 10px" />
      <a-button type="primary">提交</a-button>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
</script>
```

---

### R5: 代码片段导出

**优先级**: P2（可选）
**负责人**: TBD
**预计工时**: 0.5 天

#### 需求描述
用户可以将组件树导出为 JSX 或 Vue 代码片段，方便直接复制到现有项目中使用。

#### 验收标准
- [ ] 支持导出为 JSX 格式
- [ ] 支持导出为 Vue 模板格式
- [ ] 包含必要的 import 语句
- [ ] 代码格式化良好
- [ ] 支持一键复制到剪贴板
- [ ] 显示代码预览

#### 场景示例

**场景 1: 复制组件代码到现有项目**
- Given: 用户在低代码平台中设计了一个表单组件
- When: 用户导出为 JSX 代码片段
- Then: 可以直接复制代码到现有 React 项目中使用

---

### R6: 导出 UI 界面

**优先级**: P0（必须实现）
**负责人**: TBD
**预计工时**: 1 天

#### 需求描述
提供友好的导出操作界面，支持格式选择、选项配置、预览等功能。

#### 验收标准
- [ ] Header 中有明显的"导出"按钮
- [ ] 点击按钮打开导出弹窗（Modal）
- [ ] 弹窗包含格式选择器（卡片式或单选）
- [ ] 每种格式显示图标、名称、描述
- [ ] 支持配置选项（项目名称、包管理器等）
- [ ] 显示导出进度（Loading 状态）
- [ ] 导出成功/失败有明确提示
- [ ] 支持键盘快捷键（Ctrl+E）

#### 场景示例

**场景 1: 新用户首次导出**
- Given: 用户第一次使用导出功能
- When: 用户点击"导出"按钮
- Then: 看到清晰的格式选项卡，每个选项都有说明

**场景 2: 导出配置持久化**
- Given: 用户上次选择了 React 格式和 pnpm 包管理器
- When: 用户再次打开导出弹窗
- Then: 上次的配置被自动恢复

#### UI 设计

**格式选择器**:
```
┌─────────────────────────────────────────────┐
│  选择导出格式                                 │
├─────────────────────────────────────────────┤
│  ○ 📄 JSON 配置                              │
│     纯配置文件，用于备份和版本控制            │
│                                              │
│  ● 🌐 静态 HTML                              │
│     单文件网页，可直接在浏览器打开            │
│                                              │
│  ○ ⚛️  React 项目                            │
│     完整的 React + Vite 项目源码             │
│                                              │
│  ○ 💚 Vue 项目                               │
│     完整的 Vue 3 + Vite 项目源码             │
│                                              │
│  ○ 📝 代码片段                               │
│     JSX/Vue 组件代码，可复制使用             │
└─────────────────────────────────────────────┘
```

**配置选项面板**:
```
┌─────────────────────────────────────────────┐
│  配置选项                                     │
├─────────────────────────────────────────────┤
│  项目名称: [my-project          ]            │
│                                              │
│  □ 包含注释                                  │
│  □ 压缩 HTML                                 │
│  ☑ 引入 Ant Design CDN                       │
└─────────────────────────────────────────────┘
```

---

### R7: 导出预览功能

**优先级**: P2（可选）
**负责人**: TBD
**预计工时**: 0.5 天

#### 需求描述
在导出前预览将要生成的代码或文件内容。

#### 验收标准
- [ ] 导出弹窗中有"预览"选项卡
- [ ] 显示将要生成的主要代码
- [ ] 支持语法高亮
- [ ] 支持代码折叠
- [ ] 支持全屏预览

---

### R8: 导出配置持久化

**优先级**: P1（重要）
**负责人**: TBD
**预计工时**: 0.3 天

#### 需求描述
记住用户的导出偏好设置，下次打开时自动恢复。

#### 验收标准
- [ ] 用户选择的格式被保存到 LocalStorage
- [ ] 用户配置的选项被保存
- [ ] 下次打开导出弹窗时自动恢复
- [ ] 支持重置为默认配置

---

## 非功能需求

### NFR1: 性能要求

- 小型项目（< 20 组件）导出时间 < 1 秒
- 中型项目（20-50 组件）导出时间 < 3 秒
- 大型项目（50-100 组件）导出时间 < 5 秒
- ZIP 文件生成不阻塞 UI（使用 Loading 状态）

### NFR2: 兼容性要求

- 支持 Chrome、Firefox、Safari、Edge 最新版本
- 导出的 HTML 兼容 IE11+（可选）
- 导出的 React/Vue 项目支持 Node.js 16+

### NFR3: 可用性要求

- 导出操作步骤 ≤ 3 步
- 错误提示清晰易懂
- 提供操作指引文档
- 支持键盘快捷键

### NFR4: 可维护性要求

- 代码模块化，导出器独立
- 使用面向对象设计，易于扩展新格式
- 充分的注释和文档
- 单元测试覆盖率 > 80%

---

## 边界情况

### B1: 空项目导出
- 行为：允许导出，生成最小化的项目结构
- JSON：包含空的 components 数组
- HTML：生成空白页面
- React/Vue：生成基础项目框架

### B2: 超大项目导出
- 行为：显示进度条，分块处理
- 如果超时（> 10 秒），提示用户
- 考虑使用 Web Worker

### B3: 特殊字符处理
- 组件 props 中包含特殊字符（引号、尖括号等）
- 行为：正确转义，避免注入攻击
- JSON：使用 JSON.stringify 自动转义
- HTML：使用实体编码

### B4: 网络断开
- 行为：导出功能完全在前端完成，不受影响
- 如果引用了 CDN（Ant Design），提示用户

### B5: 浏览器限制
- 某些浏览器限制下载文件大小或频率
- 行为：捕获错误，提示用户手动下载
- 提供降级方案（显示文本，手动复制）

---

## 测试用例

### TC1: JSON 导出基础功能
- 前置条件：项目包含 5 个组件
- 操作步骤：
  1. 点击"导出"按钮
  2. 选择"JSON 配置"格式
  3. 点击"导出"
- 预期结果：下载 JSON 文件，包含完整组件树

### TC2: HTML 导出样式保留
- 前置条件：组件设置了自定义样式（颜色、字体等）
- 操作步骤：导出为 HTML
- 预期结果：在浏览器中打开，样式完整保留

### TC3: React 项目可运行性
- 前置条件：导出 React 项目
- 操作步骤：
  1. 解压 ZIP 文件
  2. 运行 `npm install`
  3. 运行 `npm run dev`
- 预期结果：项目成功启动，页面正常显示

### TC4: 嵌套组件导出
- 前置条件：创建深度嵌套的组件树（3 层以上）
- 操作步骤：导出为任意格式
- 预期结果：嵌套结构完整保留

### TC5: 事件处理器导出
- 前置条件：Button 组件配置了 onClick 事件
- 操作步骤：导出为 HTML 和 React
- 预期结果：
  - HTML：事件转换为 onclick 属性
  - React：事件转换为 onClick 处理器

---

## 依赖项

### 外部库依赖
- `jszip: ^3.10.1` - ZIP 文件生成
- `file-saver: ^2.0.5` - 文件下载
- `prettier: ^3.4.2` - 代码格式化

### 内部依赖
- componentsStore - 组件树数据
- projectStore - 项目元数据
- componentConfigStore - 组件配置

---

## 未来扩展

### 导出为 Angular 项目
- 支持 Angular + TypeScript 项目导出

### 导出为移动端项目
- React Native
- Flutter
- 微信小程序

### 在线部署集成
- 一键部署到 Vercel
- 一键部署到 Netlify
- 生成分享链接

### 自定义组件支持
- 用户上传的自定义组件也能正确导出
- 插件化导出器架构

---

**规格文档版本**: v1.0
**最后更新**: 2025-11-17
**审核状态**: 待审核
