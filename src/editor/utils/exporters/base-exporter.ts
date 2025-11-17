import { saveAs } from 'file-saver'
import type { Component } from '@/editor/stores/components'
import type { ExportFormat, ExportOptions, ExportResult, IExporter } from './types'

/**
 * 导出器基类
 * 使用模板方法模式，定义导出流程
 */
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
      this.prepare(components, options)

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

    switch (format) {
      case 'json':
        return `${projectName}-config.json`
      case 'html':
        return `${projectName}.html`
      case 'react':
        return `${projectName}-react.zip`
      case 'vue':
        return `${projectName}-vue.zip`
      case 'snippet':
        return `${projectName}-snippet.txt`
      default:
        return `${projectName}.txt`
    }
  }
}
