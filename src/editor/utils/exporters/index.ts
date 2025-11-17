import type { IExporter } from './types'
import { ExportFormat } from './types'
import { JSONExporter } from './json-exporter'
import { HTMLExporter } from './html-exporter'

/**
 * 导出器工厂
 */
export class ExporterFactory {
  /**
   * 根据格式创建对应的导出器
   */
  static create(format: ExportFormat): IExporter {
    switch (format) {
      case ExportFormat.JSON:
        return new JSONExporter()

      case ExportFormat.HTML:
        return new HTMLExporter()

      // Phase 2
      case ExportFormat.REACT:
        throw new Error('React 项目导出功能将在 Phase 2 实现')

      case ExportFormat.VUE:
        throw new Error('Vue 项目导出功能将在 Phase 2 实现')

      // Phase 3
      case ExportFormat.SNIPPET:
        throw new Error('代码片段导出功能将在 Phase 3 实现')

      default:
        throw new Error(`不支持的导出格式: ${format}`)
    }
  }
}

// 导出类型和枚举
export { ExportFormat, type ExportOptions, type ExportResult, type IExporter } from './types'
