# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

---

项目简介
- 技术栈：Vite + React 19 + TypeScript + Ant Design + Tailwind CSS + Zustand + React DnD
- 目标：一个可视化低代码编辑器（物料区/画布区/属性区/预览/大纲/源码）
- 主要端口：开发服务器默认 3333（见 `vite.config.ts`）

常用命令
- 安装依赖（优先使用 npm，仓库包含 `package-lock.json`）
  - 全量安装：
    - PowerShell：`npm install`
    - CI/干净安装：`npm ci`
- 本地开发：`npm run dev`
  - 启动 Vite 开发服务器（端口 3333，自动打开浏览器）
- 生产构建：`npm run build`
  - 先运行 TypeScript 构建（`tsc -b`），再执行 `vite build`
- 本地预览构建产物：`npm run preview`
- 代码检查：`npm run lint`
  - 单文件检查：`npx eslint src/editor/components/EditArea/index.tsx`
  - 自动修复：`npx eslint . --fix`
- 测试：当前仓库未配置测试框架与脚本（无 `vitest/jest` 等配置），因此不支持“运行单测”的命令。

高层架构与重要模块
1) 应用外壳与布局（编辑/预览两态）
- 入口：`src/App.tsx` → `src/editor/index.tsx`
- 分栏布局：使用 `allotment` 实现三栏（物料区 | 画布区 | 属性区），头部工具栏 `Header`
- 编辑/预览切换：由 Zustand 仓库的 `mode` 控制（`edit` / `preview`）

2) 状态模型（Zustand）
- 组件树仓库 `src/editor/stores/components.tsx`
  - State：`components`（整棵页面 JSON 树）、`curComponentId`、`curComponent`、`mode`
  - Action：
    - `addComponent(component, parentId?)` 将组件对象挂载到指定父节点
    - `deleteComponent(componentId)` 从父级 `children` 或顶层数组删除
    - `updateComponentProps(componentId, props)` 合并属性并同步选中态
    - `updateComponentStyles(componentId, styles)` 合并样式并同步选中态
    - `updateComponentEvents(componentId, events)` 合并事件配置
    - `setCurComponentId(id)`、`setMode(mode)`
  - 辅助：`getComponentById` 深度查找组件节点

3) 物料注册与属性/样式/事件配置
- 组件注册表 `src/editor/stores/component-config.tsx`
  - 每个物料包含：`name`、`defaultProps`、`desc`、`dev`（编辑态渲染）、`prod`（预览态渲染）
  - 可选配置：
    - `setter`: 属性编辑器的元数据（如输入框、下拉、选项）
    - `stylesSetter`: 样式编辑器的元数据（如宽高、字体等）
  - 内置物料示例：`Container`、`Button`、`Page`、`Text`、`Title`、`Input`、`Image`、`Card`
  - 扩展：通过 `registerComponent(name, componentConfig)` 动态扩充物料

4) 渲染与交互（画布区）
- 组件树渲染：`src/editor/components/EditArea/index.tsx`
  - 依据仓库中的 JSON 树，使用 `React.createElement(config.dev, {...})` 递归渲染
  - 将选中与悬停状态用覆盖蒙层表现：`HoverMask`、`SelectedMask`
  - 点击冒泡选择组件，维护 `curComponentId`

5) 拖拽放置（物料 → 画布）
- Hook：`src/editor/hooks/useMaterialDrop.ts`
  - 基于 `react-dnd` 的 `useDrop`
  - 接收物料类型（如 `Button`、`Container`），落点在容器组件时将新节点附加到该容器
  - 新节点的 `props/desc` 来自物料注册表的 `defaultProps/desc`

6) 右侧面板（属性 | 外观 | 事件）
- 容器：`src/editor/components/Setting/index.tsx`
  - 顶部使用 `Segmented` 切换三类编辑
  - 各子面板：
    - `ComponentAttr`（属性编辑，基于 `setter`）
    - `ComponentStyle`（样式编辑，基于 `stylesSetter`）
    - `ComponentEvent`（事件编辑，写入到组件节点的 `events`）

7) 事件执行引擎（仅预览态生效）
- 模块：`src/editor/utils/event-executor.ts`
  - 支持动作：`showMessage`、`navigate`、`setState`、`callAPI`、`customScript`
  - 特性：变量替换（`{{variable}}` 语法）、统一错误处理、异步动作支持
  - 上下文可用于更新组件属性或访问当前组件信息

8) 预览/大纲/源码（高层能力）
- 预览：与画布同源的“递归渲染”，区别在于预览态会触发组件事件
- 大纲/源码：README 中说明已实现（源码展示依赖 `@monaco-editor/react`）

9) 样式与主题
- 全局样式：`src/index.css` 使用 Tailwind 指令（`@tailwind base/components/utilities`）和自定义工具类
- 主题：`src/main.tsx` 通过 `ConfigProvider` 自定义 AntD 主题 Token 与组件样式

关键路径速览
- 入口/布局：`src/App.tsx`、`src/editor/index.tsx`
- 物料注册：`src/editor/stores/component-config.tsx`
- 组件树状态：`src/editor/stores/components.tsx`
- 画布渲染：`src/editor/components/EditArea/index.tsx`
- 右侧面板：`src/editor/components/Setting/`
- 拖拽放置：`src/editor/hooks/useMaterialDrop.ts`
- 事件执行：`src/editor/utils/event-executor.ts`

与 README 的一致性
- 当前 WARP.md 的架构要点与 `README.md` 中的“项目梳理/功能点（拖拽、蒙层、属性/样式/事件、预览/大纲/源码）”保持一致；端口与开发方式以 `vite.config.ts` 与 `package.json` 为准。

维护建议（面向 Warp）
- 如果新增测试框架（如 Vitest），请在 `package.json` 添加相应脚本（如 `test`、`test:watch`），并补充本文件的“常用命令/单测”小节。
- 若新增物料，请同时提供 `dev` 与 `prod` 组件并在注册表中填充 `setter/stylesSetter`，确保编辑态与预览态一致性。