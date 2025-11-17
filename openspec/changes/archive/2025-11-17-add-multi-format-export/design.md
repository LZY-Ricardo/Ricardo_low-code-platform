# Design: 多格式导出系统设计文档

## 系统架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户界面层                            │
│  ┌────────────┐           ┌──────────────────────┐         │
│  │   Header   │  ────►    │   ExportModal        │         │
│  │  导出按钮  │           │  - FormatSelector    │         │
│  └────────────┘           │  - OptionsPanel      │         │
│                           │  - PreviewPanel      │         │
│                           └──────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────┐
│                        导出引擎层                            │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │           BaseExporter（抽象基类）                  │    │
│  │  - validate()      // 验证组件树                    │    │
│  │  - prepare()       // 准备数据                      │    │
│  │  - generate()      // 生成内容（抽象方法）          │    │
│  │  - download()      // 下载文件                      │    │
│  └────────────────────────────────────────────────────┘    │
│                             │                                │
│         ┌───────────────────┼───────────────────┐           │
│         ▼                   ▼                   ▼           │
│  ┌─────────────┐   ┌──────────────┐   ┌─────────────┐     │
│  │   JSON      │   │     HTML     │   │   React     │     │
│  │  Exporter   │   │   Exporter   │   │  Exporter   │     │
│  └─────────────┘   └──────────────┘   └─────────────┘     │
│         ▼                   ▼                   ▼           │
│  ┌─────────────┐   ┌──────────────┐   ┌─────────────┐     │
│  │    Vue      │   │   Snippet    │   │   (Future)  │     │
│  │  Exporter   │   │   Exporter   │   │  Exporter   │     │
│  └─────────────┘   └──────────────┘   └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────┐
│                        工具层                                │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Code     │  │   Template   │  │  File Utils  │      │
│  │  Generator  │  │   Manager    │  │  - JSZip     │      │
│  │             │  │              │  │  - FileSaver │      │
│  └─────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────┐
│                        数据层                                │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Components  │  │    Project   │  │ Component    │      │
│  │   Store     │  │    Store     │  │ Config Store │      │
│  └─────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 核心模块设计

### 1. 类型定义（types.ts）

```typescript
// 导出格式枚举
export enum ExportFormat {
  JSON = 'json',
  HTML = 'html',
  REACT = 'react',
  VUE = 'vue',
  SNIPPET = 'snippet'
}

// 导出选项
export interface ExportOptions {
  // 通用选项
  projectName: string
  format: ExportFormat
  includeComments?: boolean
  indentSize?: 2 | 4
  indentType?: 'space' | 'tab'

  // HTML 特有选项
  minifyHTML?: boolean
  inlineCSS?: boolean
  includeAntdCDN?: boolean

  // 项目导出特有选项
  packageManager?: 'npm' | 'pnpm' | 'yarn'
  includeTypeScript?: boolean
  includeESLint?: boolean
  includePrettier?: boolean

  // 代码片段选项
  snippetType?: 'jsx' | 'vue'
}

// 导出结果
export interface ExportResult {
  success: boolean
  format: ExportFormat
  fileName: string
  fileSize?: number
  message?: string
  error?: Error
}

// 导出器接口
export interface IExporter {
  format: ExportFormat
  validate(components: Component[]): boolean
  export(components: Component[], options: ExportOptions): Promise<ExportResult>
}
```

### 2. 基础导出器（base-exporter.ts）

```typescript
import { Component } from '@/editor/stores/components'
import { ExportFormat, ExportOptions, ExportResult, IExporter } from './types'

export abstract class BaseExporter implements IExporter {
  abstract format: ExportFormat

  /**
   * 验证组件树是否有效
   */
  validate(components: Component[]): boolean {
    if (!components || components.length === 0) {
      throw new Error('组件树为空，无法导出')
    }

    // 检查是否有 Page 根组件
    const hasPage = components.some(c => c.name === 'Page')
    if (!hasPage) {
      throw new Error('缺少 Page 根组件')
    }

    return true
  }

  /**
   * 准备导出数据
   */
  protected prepare(components: Component[], options: ExportOptions) {
    return {
      components,
      projectName: options.projectName || 'lowcode-project',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  }

  /**
   * 生成导出内容（由子类实现）
   */
  protected abstract generate(
    components: Component[],
    options: ExportOptions
  ): Promise<Blob | string>

  /**
   * 下载文件
   */
  protected download(content: Blob | string, fileName: string) {
    const blob = content instanceof Blob
      ? content
      : new Blob([content], { type: 'text/plain;charset=utf-8' })

    saveAs(blob, fileName)
  }

  /**
   * 导出方法（模板方法模式）
   */
  async export(
    components: Component[],
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      // 1. 验证
      this.validate(components)

      // 2. 准备
      const data = this.prepare(components, options)

      // 3. 生成
      const content = await this.generate(components, options)

      // 4. 下载
      const fileName = this.getFileName(options)
      this.download(content, fileName)

      // 5. 返回结果
      return {
        success: true,
        format: this.format,
        fileName,
        message: `${fileName} 导出成功`
      }
    } catch (error) {
      return {
        success: false,
        format: this.format,
        fileName: '',
        error: error as Error,
        message: `导出失败：${(error as Error).message}`
      }
    }
  }

  /**
   * 生成文件名
   */
  protected getFileName(options: ExportOptions): string {
    const { projectName, format } = options
    const timestamp = new Date().getTime()

    switch (format) {
      case ExportFormat.JSON:
        return `${projectName}-config.json`
      case ExportFormat.HTML:
        return `${projectName}.html`
      case ExportFormat.REACT:
        return `${projectName}-react.zip`
      case ExportFormat.VUE:
        return `${projectName}-vue.zip`
      case ExportFormat.SNIPPET:
        return `${projectName}-snippet.txt`
      default:
        return `${projectName}-${timestamp}.txt`
    }
  }
}
```

### 3. JSON 导出器（json-exporter.ts）

```typescript
import { BaseExporter } from './base-exporter'
import { ExportFormat, ExportOptions } from './types'
import { Component } from '@/editor/stores/components'

export class JSONExporter extends BaseExporter {
  format = ExportFormat.JSON

  protected async generate(
    components: Component[],
    options: ExportOptions
  ): Promise<string> {
    const data = this.prepare(components, options)

    const exportData = {
      meta: {
        name: data.projectName,
        version: data.version,
        exportTime: data.timestamp,
        generator: 'LowCode Platform'
      },
      components: this.sanitizeComponents(components)
    }

    // 格式化 JSON
    const indent = options.indentType === 'tab'
      ? '\t'
      : ' '.repeat(options.indentSize || 2)

    return JSON.stringify(exportData, null, indent)
  }

  /**
   * 清理组件数据（移除循环引用等）
   */
  private sanitizeComponents(components: Component[]): any {
    return JSON.parse(JSON.stringify(components))
  }
}
```

### 4. HTML 导出器（html-exporter.ts）

```typescript
import { BaseExporter } from './base-exporter'
import { ExportFormat, ExportOptions } from './types'
import { Component } from '@/editor/stores/components'

export class HTMLExporter extends BaseExporter {
  format = ExportFormat.HTML

  protected async generate(
    components: Component[],
    options: ExportOptions
  ): Promise<string> {
    const { projectName, includeAntdCDN = true } = options

    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  ${includeAntdCDN ? this.getAntdCDN() : ''}
  <style>
    ${this.getBaseStyles()}
    ${this.getComponentStyles(components)}
  </style>
</head>
<body>
  ${this.renderComponents(components)}

  <script>
    ${this.getInteractiveScripts()}
  </script>
</body>
</html>
    `.trim()

    return options.minifyHTML ? this.minify(html) : html
  }

  /**
   * 渲染组件树为 HTML
   */
  private renderComponents(components: Component[], level = 0): string {
    return components.map(component => {
      const { name, props, styles, children } = component

      // 获取 HTML 标签
      const tag = this.getHTMLTag(name)

      // 处理属性
      const attrs = this.getHTMLAttributes(name, props)

      // 处理样式
      const style = styles ? this.styleObjectToString(styles) : ''

      // 渲染开标签
      let html = `<${tag}${attrs}${style ? ` style="${style}"` : ''}>`

      // 渲染内容
      if (children && children.length > 0) {
        html += '\n' + this.renderComponents(children, level + 1)
      } else if (props?.text) {
        html += props.text
      }

      // 渲染闭标签
      html += `</${tag}>`

      return html
    }).join('\n')
  }

  /**
   * 组件名映射为 HTML 标签
   */
  private getHTMLTag(componentName: string): string {
    const tagMap: Record<string, string> = {
      'Page': 'div',
      'Container': 'div',
      'Button': 'button',
      'Input': 'input',
      'Text': 'span',
      'Title': 'h1', // 需要根据 level 动态处理
      'Image': 'img',
      'Card': 'div'
    }

    return tagMap[componentName] || 'div'
  }

  /**
   * 生成 HTML 属性
   */
  private getHTMLAttributes(componentName: string, props: any): string {
    let attrs = ''

    switch (componentName) {
      case 'Button':
        if (props?.type) attrs += ` class="btn-${props.type}"`
        break
      case 'Input':
        if (props?.placeholder) attrs += ` placeholder="${props.placeholder}"`
        if (props?.value) attrs += ` value="${props.value}"`
        break
      case 'Image':
        if (props?.src) attrs += ` src="${props.src}"`
        if (props?.alt) attrs += ` alt="${props.alt}"`
        if (props?.width) attrs += ` width="${props.width}"`
        if (props?.height) attrs += ` height="${props.height}"`
        break
    }

    return attrs
  }

  /**
   * 样式对象转字符串
   */
  private styleObjectToString(styles: any): string {
    return Object.entries(styles)
      .map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
        return `${cssKey}: ${value}`
      })
      .join('; ')
  }

  /**
   * 获取 Ant Design CDN
   */
  private getAntdCDN(): string {
    return `
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/antd@5/dist/reset.css" />
    `.trim()
  }

  /**
   * 获取基础样式
   */
  private getBaseStyles(): string {
    return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .btn-primary { background: #1677ff; color: white; border: none; padding: 4px 15px; cursor: pointer; }
    .btn-default { background: white; color: #000; border: 1px solid #d9d9d9; padding: 4px 15px; cursor: pointer; }
    `.trim()
  }

  /**
   * 获取组件自定义样式
   */
  private getComponentStyles(components: Component[]): string {
    // 遍历组件，生成自定义样式类
    return ''
  }

  /**
   * 获取交互脚本
   */
  private getInteractiveScripts(): string {
    return `
    // 简单的事件处理
    document.querySelectorAll('[data-event]').forEach(el => {
      el.addEventListener('click', (e) => {
        const eventData = JSON.parse(el.getAttribute('data-event'))
        if (eventData.actionType === 'showMessage') {
          alert(eventData.actionConfig.content)
        }
      })
    })
    `.trim()
  }

  /**
   * 压缩 HTML
   */
  private minify(html: string): string {
    return html
      .replace(/\n\s+/g, '\n')
      .replace(/\n/g, '')
      .replace(/>\s+</g, '><')
  }
}
```

### 5. React 项目导出器（react-exporter.ts）

```typescript
import JSZip from 'jszip'
import { BaseExporter } from './base-exporter'
import { ExportFormat, ExportOptions } from './types'
import { Component } from '@/editor/stores/components'
import { CodeGenerator } from './code-generator'
import { TemplateManager } from './template-manager'

export class ReactExporter extends BaseExporter {
  format = ExportFormat.REACT
  private codeGen = new CodeGenerator()
  private templateMgr = new TemplateManager()

  protected async generate(
    components: Component[],
    options: ExportOptions
  ): Promise<Blob> {
    const zip = new JSZip()
    const { projectName } = options

    // 1. 生成 package.json
    const packageJson = this.generatePackageJson(projectName, options)
    zip.file('package.json', JSON.stringify(packageJson, null, 2))

    // 2. 生成配置文件
    zip.file('vite.config.ts', this.templateMgr.getReactViteConfig())
    zip.file('tsconfig.json', this.templateMgr.getReactTSConfig())
    zip.file('tsconfig.node.json', this.templateMgr.getReactTSNodeConfig())

    // 3. 生成入口文件
    zip.file('index.html', this.templateMgr.getReactIndexHTML(projectName))
    zip.file('src/main.tsx', this.templateMgr.getReactMain())

    // 4. 生成 App 组件
    const appCode = this.codeGen.generateReactComponent(components)
    zip.file('src/App.tsx', appCode)

    // 5. 生成 README
    zip.file('README.md', this.generateReadme(projectName, 'React'))

    // 6. 生成 .gitignore
    zip.file('.gitignore', this.templateMgr.getGitignore())

    // 7. 可选：ESLint 配置
    if (options.includeESLint) {
      zip.file('eslint.config.js', this.templateMgr.getESLintConfig())
    }

    // 8. 可选：Prettier 配置
    if (options.includePrettier) {
      zip.file('.prettierrc', this.templateMgr.getPrettierConfig())
    }

    // 生成 ZIP
    return await zip.generateAsync({ type: 'blob' })
  }

  /**
   * 生成 package.json
   */
  private generatePackageJson(projectName: string, options: ExportOptions) {
    return {
      name: projectName,
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc -b && vite build',
        preview: 'vite preview',
        ...(options.includeESLint && { lint: 'eslint .' })
      },
      dependencies: {
        'react': '^19.1.0',
        'react-dom': '^19.1.0',
        'antd': '^5.26.5'
      },
      devDependencies: {
        '@vitejs/plugin-react': '^4.6.0',
        'typescript': '~5.8.3',
        'vite': '^7.0.4',
        ...(options.includeESLint && {
          'eslint': '^9.30.1',
          '@typescript-eslint/eslint-plugin': '^8.35.1'
        }),
        ...(options.includePrettier && {
          'prettier': '^3.4.2'
        })
      }
    }
  }

  /**
   * 生成 README
   */
  private generateReadme(projectName: string, framework: string): string {
    return `# ${projectName}

这是一个由低代码平台导出的 ${framework} 项目。

## 快速开始

\`\`\`bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
\`\`\`

## 项目结构

- \`src/App.tsx\` - 主应用组件
- \`src/main.tsx\` - 应用入口

## 技术栈

- ${framework} 19
- Vite 7
- Ant Design 5
- TypeScript 5

---

由低代码平台导出 @ ${new Date().toLocaleDateString()}
`
  }
}
```

### 6. 代码生成器（code-generator.ts）

```typescript
import { Component } from '@/editor/stores/components'
import prettier from 'prettier'

export class CodeGenerator {
  /**
   * 生成 React 组件代码
   */
  generateReactComponent(components: Component[]): string {
    const imports = this.generateReactImports(components)
    const componentCode = this.generateReactJSX(components)

    const code = `
${imports}

function App() {
  return (
    ${componentCode}
  )
}

export default App
    `.trim()

    return this.formatCode(code, 'typescript')
  }

  /**
   * 生成 React imports
   */
  private generateReactImports(components: Component[]): string {
    const antdComponents = this.extractAntdComponents(components)

    let imports = "import React from 'react'\n"

    if (antdComponents.length > 0) {
      imports += `import { ${antdComponents.join(', ')} } from 'antd'\n`
    }

    return imports
  }

  /**
   * 提取使用的 Ant Design 组件
   */
  private extractAntdComponents(components: Component[]): string[] {
    const antdMap: Record<string, string> = {
      'Button': 'Button',
      'Input': 'Input',
      'Card': 'Card'
    }

    const used = new Set<string>()

    const traverse = (comps: Component[]) => {
      comps.forEach(comp => {
        if (antdMap[comp.name]) {
          used.add(antdMap[comp.name])
        }
        if (comp.children) {
          traverse(comp.children)
        }
      })
    }

    traverse(components)
    return Array.from(used)
  }

  /**
   * 生成 React JSX
   */
  private generateReactJSX(components: Component[], indent = 2): string {
    const indentStr = ' '.repeat(indent)

    return components.map(comp => {
      const { name, props, styles, children } = comp

      // 组件标签
      const tag = this.getReactComponentTag(name)

      // 属性
      const propsStr = this.generateReactProps(props)

      // 样式
      const styleStr = styles ? ` style={${JSON.stringify(styles)}}` : ''

      // 子元素
      const hasChildren = children && children.length > 0
      const hasTextContent = props?.text

      if (!hasChildren && !hasTextContent) {
        // 自闭合标签
        return `${indentStr}<${tag}${propsStr}${styleStr} />`
      } else {
        // 有子元素或文本内容
        let jsx = `${indentStr}<${tag}${propsStr}${styleStr}>\n`

        if (hasTextContent) {
          jsx += `${indentStr}  ${props.text}\n`
        }

        if (hasChildren) {
          jsx += this.generateReactJSX(children, indent + 2) + '\n'
        }

        jsx += `${indentStr}</${tag}>`

        return jsx
      }
    }).join('\n')
  }

  /**
   * 获取 React 组件标签
   */
  private getReactComponentTag(componentName: string): string {
    const tagMap: Record<string, string> = {
      'Page': 'div',
      'Container': 'div',
      'Button': 'Button',
      'Input': 'Input',
      'Text': 'span',
      'Title': 'h1',
      'Image': 'img',
      'Card': 'Card'
    }

    return tagMap[componentName] || 'div'
  }

  /**
   * 生成 React props
   */
  private generateReactProps(props: any): string {
    if (!props) return ''

    const propsArray = Object.entries(props)
      .filter(([key]) => key !== 'text') // text 作为 children 处理
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`
        } else {
          return `${key}={${JSON.stringify(value)}}`
        }
      })

    return propsArray.length > 0 ? ' ' + propsArray.join(' ') : ''
  }

  /**
   * 格式化代码
   */
  private formatCode(code: string, parser: string = 'typescript'): string {
    try {
      return prettier.format(code, {
        parser,
        semi: false,
        singleQuote: true,
        tabWidth: 2
      })
    } catch (error) {
      console.error('代码格式化失败', error)
      return code
    }
  }

  /**
   * 生成 Vue 组件代码
   */
  generateVueComponent(components: Component[]): string {
    const template = this.generateVueTemplate(components)
    const script = this.generateVueScript(components)

    return `
<template>
${template}
</template>

${script}

<style scoped>
/* 自定义样式 */
</style>
    `.trim()
  }

  /**
   * 生成 Vue template
   */
  private generateVueTemplate(components: Component[], indent = 1): string {
    // 类似 React JSX，但使用 Vue 模板语法
    // 实现省略...
    return '<div>Vue Template</div>'
  }

  /**
   * 生成 Vue script
   */
  private generateVueScript(components: Component[]): string {
    return `
<script setup lang="ts">
import { ref } from 'vue'
</script>
    `.trim()
  }
}
```

---

## UI 组件设计

### ExportModal 组件

```typescript
interface ExportModalProps {
  visible: boolean
  onClose: () => void
  projectName: string
  components: Component[]
}

const ExportModal: React.FC<ExportModalProps> = ({
  visible,
  onClose,
  projectName,
  components
}) => {
  const [format, setFormat] = useState<ExportFormat>(ExportFormat.JSON)
  const [options, setOptions] = useState<ExportOptions>({
    projectName,
    format: ExportFormat.JSON
  })
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const exporter = ExporterFactory.create(format)
      const result = await exporter.export(components, options)

      if (result.success) {
        message.success(result.message)
        onClose()
      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('导出失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="导出项目"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>取消</Button>,
        <Button key="export" type="primary" loading={loading} onClick={handleExport}>
          导出
        </Button>
      ]}
    >
      <FormatSelector value={format} onChange={setFormat} />
      <OptionsPanel format={format} options={options} onChange={setOptions} />
    </Modal>
  )
}
```

---

## 数据流设计

```
用户点击"导出"按钮
    ↓
打开 ExportModal
    ↓
用户选择导出格式
    ↓
用户配置导出选项
    ↓
点击"导出"按钮
    ↓
ExporterFactory 创建对应的导出器
    ↓
调用 exporter.export(components, options)
    ↓
[BaseExporter.export 模板方法]
    ├→ validate()      // 验证组件树
    ├→ prepare()       // 准备数据
    ├→ generate()      // 生成内容（子类实现）
    ├→ download()      // 下载文件
    └→ return result
    ↓
显示成功/失败提示
    ↓
关闭 Modal
```

---

## 性能优化策略

### 1. 大组件树优化
- 使用 Web Worker 处理代码生成（Phase 3）
- 分块处理，避免阻塞主线程
- 添加进度条反馈

### 2. ZIP 生成优化
- 使用流式压缩
- 设置合理的压缩级别（compression: 6）
- 不压缩已压缩的文件（图片等）

### 3. 内存优化
- 及时释放大对象
- 避免重复序列化
- 使用对象池复用

### 4. 缓存策略
- 缓存项目模板文件
- 缓存代码生成结果（组件未变化时）

---

## 错误处理

### 错误分类

1. **验证错误**
   - 组件树为空
   - 缺少必要组件
   - 数据格式不正确

2. **生成错误**
   - 模板文件缺失
   - 代码生成失败
   - ZIP 打包失败

3. **下载错误**
   - 文件过大
   - 浏览器限制
   - 存储空间不足

### 错误处理策略

```typescript
try {
  // 导出逻辑
} catch (error) {
  if (error instanceof ValidationError) {
    message.error('数据验证失败：' + error.message)
  } else if (error instanceof GenerationError) {
    message.error('代码生成失败：' + error.message)
  } else {
    message.error('导出失败，请稍后重试')
    console.error('Export error:', error)
  }
}
```

---

## 测试策略

### 单元测试
- BaseExporter 基类方法测试
- 各导出器的 generate 方法测试
- CodeGenerator 代码生成测试
- TemplateManager 模板读取测试

### 集成测试
- 完整导出流程测试
- 导出文件可用性测试
- 不同格式组合测试

### E2E 测试
- UI 交互测试
- 真实项目导出测试
- 跨浏览器兼容性测试

---

**设计文档版本**: v1.0
**最后更新**: 2025-11-17
