import type { IExporter } from './types'
import { ExportFormat } from './types'
import { JSONExporter } from './json-exporter'
import { HTMLExporter } from './html-exporter'
import { ReactExporter } from './react-exporter'
import { VueExporter } from './vue-exporter'
import { SnippetExporter } from './snippet-exporter'

export class ExporterFactory {
  static create(format: ExportFormat): IExporter {
    switch (format) {
      case ExportFormat.JSON:
        return new JSONExporter()

      case ExportFormat.HTML:
        return new HTMLExporter()

      case ExportFormat.REACT:
        return new ReactExporter()

      case ExportFormat.VUE:
        return new VueExporter()

      case ExportFormat.SNIPPET:
        return new SnippetExporter()

      default:
        throw new Error(`不支持的导出格式: ${format}`)
    }
  }
}

// 导出类型和枚举
export { ExportFormat, type ExportOptions, type ExportResult, type IExporter } from './types'
