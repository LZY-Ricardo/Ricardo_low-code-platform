import { BaseExporter } from './base-exporter'
import { ExportFormat, type ExportOptions } from './types'
import type { Component } from '@/editor/stores/components'

/**
 * JSON 配置导出器
 * 将组件树导出为 JSON 配置文件
 */
export class JSONExporter extends BaseExporter {
  format = ExportFormat.JSON

  protected async generate(
    components: Component[],
    options: ExportOptions
  ): Promise<string> {
    const data = this.prepare(components, options)

    // 构建导出数据
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
    // 使用 JSON 序列化/反序列化来深拷贝并移除函数等不可序列化的内容
    return JSON.parse(JSON.stringify(components))
  }
}
