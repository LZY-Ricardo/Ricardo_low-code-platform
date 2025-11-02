/**
 * 事件执行引擎
 * 
 * 负责执行组件事件配置中定义的各种动作
 * 支持的动作类型包括：显示消息、页面跳转、更新组件状态、调用 API、执行自定义脚本
 * 
 * 特性：
 * - 支持变量替换（{{variable}} 语法）
 * - 统一的错误处理
 * - 异步动作支持
 */
import { message } from 'antd'
import type { ComponentEvent, EventContext, ShowMessageConfig, NavigateConfig, SetStateConfig, CallAPIConfig, CustomScriptConfig } from '../types/event'

class EventExecutor {
    /**
     * 执行事件动作
     * 
     * 根据事件配置的动作类型，调用相应的处理方法执行动作
     * 
     * @param event - 组件事件配置
     * @param context - 事件执行上下文
     * 
     * @example
     * ```typescript
     * await eventExecutor.executeAction({
     *   eventType: 'onClick',
     *   actionType: 'showMessage',
     *   actionConfig: { type: 'success', content: '操作成功' }
     * }, context)
     * ```
     */
    async executeAction(event: ComponentEvent, context: EventContext): Promise<void> {
        try {
            switch (event.actionType) {
                case 'showMessage':
                    await this.showMessage(event.actionConfig as unknown as ShowMessageConfig, context)
                    break
                case 'navigate':
                    await this.navigate(event.actionConfig as unknown as NavigateConfig, context)
                    break
                case 'setState':
                    await this.setState(event.actionConfig as unknown as SetStateConfig, context)
                    break
                case 'callAPI':
                    await this.callAPI(event.actionConfig as unknown as CallAPIConfig, context)
                    break
                case 'customScript':
                    await this.executeScript(event.actionConfig as unknown as CustomScriptConfig, context)
                    break
                default:
                    console.warn('Unknown action type:', event.actionType)
            }
        } catch (error) {
            console.error('Event execution error:', error)
            message.error('事件执行失败')
        }
    }

    /**
     * 显示消息提示
     * 
     * 使用 Ant Design 的 message 组件显示消息提示
     * 支持变量替换，例如：content: "组件 {{componentId}} 被点击了"
     * 
     * @param config - 消息配置
     * @param context - 事件上下文
     */
    private async showMessage(config: ShowMessageConfig, context: EventContext): Promise<void> {
        // 替换消息内容中的变量
        const content = this.replaceVariables(config.content, context)
        // 显示消息（默认显示 3 秒）
        message[config.type](content, config.duration || 3)
    }

    /**
     * 页面跳转
     * 
     * 支持当前窗口跳转和新标签页打开两种方式
     * URL 支持变量替换
     * 
     * @param config - 跳转配置
     * @param context - 事件上下文
     */
    private async navigate(config: NavigateConfig, context: EventContext): Promise<void> {
        // 替换 URL 中的变量
        const url = this.replaceVariables(config.url, context)

        if (config.openInNewTab) {
            // 在新标签页打开
            window.open(url, '_blank')
        } else {
            // 在当前窗口跳转
            window.location.href = url
        }
    }

    /**
     * 更新组件状态
     * 
     * 更新指定组件的属性（props）
     * 支持变量替换，属性值中的字符串会进行变量替换
     * 
     * @param config - 状态更新配置
     * @param context - 事件上下文
     * 
     * @example
     * config: {
     *   componentId: 123,
     *   props: { text: "新文本 {{componentId}}" }
     * }
     */
    private async setState(config: SetStateConfig, context: EventContext): Promise<void> {
        // 构建新的属性对象，替换其中的变量
        const props: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(config.props || {})) {
            if (typeof value === 'string') {
                // 字符串类型的值进行变量替换
                props[key] = this.replaceVariables(value, context)
            } else {
                // 其他类型直接使用原值
                props[key] = value
            }
        }
        // 更新组件属性
        context.updateComponentProps(config.componentId, props)
    }

    /**
     * 调用 API
     * 
     * 发送 HTTP 请求到指定的 API 地址
     * 支持 GET、POST、PUT、DELETE 方法
     * URL 支持变量替换
     * 
     * @param config - API 调用配置
     * @param context - 事件上下文
     * 
     * @throws 当 API 调用失败时抛出错误
     * 
     * @example
     * config: {
     *   url: "/api/user/{{componentId}}",
     *   method: "GET"
     * }
     */
    private async callAPI(config: CallAPIConfig, context: EventContext): Promise<void> {
        try {
            // 替换 URL 中的变量
            const url = this.replaceVariables(config.url, context)

            // 构建请求选项
            const options: RequestInit = {
                method: config.method,
                headers: {
                    'Content-Type': 'application/json',
                    ...config.headers,  // 允许自定义请求头
                },
            }

            // 非 GET 请求将参数放在 body 中
            if (config.method !== 'GET' && config.params) {
                options.body = JSON.stringify(config.params)
            }

            // 发送请求
            const response = await fetch(url, options)
            const data = await response.json()

            // 检查响应状态
            if (!response.ok) {
                throw new Error(data.message || 'API call failed')
            }

            // 可以将响应数据存储到全局状态或触发其他动作
            // TODO: 可以实现响应数据的处理逻辑
            console.log('API response:', data)
        } catch (error) {
            console.error('API call error:', error)
            throw error
        }
    }

    /**
     * 执行自定义脚本
     * 
     * 执行用户定义的 JavaScript 代码
     * 脚本中可以通过 context 参数访问事件上下文
     * 
     * @param config - 脚本配置
     * @param context - 事件上下文
     * 
     * @throws 当脚本执行出错时抛出错误
     * 
     * @example
     * script: `
     *   console.log('组件ID:', context.componentId);
     *   context.updateComponentProps(123, { text: '更新后的文本' });
     * `
     * 
     * 注意：自定义脚本有安全风险，在生产环境中应该谨慎使用或禁用
     */
    private async executeScript(config: CustomScriptConfig, context: EventContext): Promise<void> {
        try {
            // 使用 Function 构造函数创建函数
            // 注意：这里使用 new Function 而不是 eval，相对更安全
            const func = new Function('context', config.script)
            // 执行函数，传入上下文
            func(context)
        } catch (error) {
            console.error('Script execution error:', error)
            throw error
        }
    }

    /**
     * 替换变量（支持 {{variable}} 语法）
     * 
     * 将模板字符串中的 {{variable}} 替换为实际值
     * 支持嵌套属性访问，如 {{component.props.text}}
     * 
     * @param template - 包含变量的模板字符串
     * @param context - 事件上下文，用于获取变量值
     * @returns 替换后的字符串
     * 
     * @example
     * replaceVariables("组件 {{componentId}} 被点击", context)
     * // 返回: "组件 123 被点击"
     * 
     * replaceVariables("{{component.props.text}}", context)
     * // 返回组件属性中的 text 值
     */
    private replaceVariables(template: string, context: EventContext): string {
        // 使用正则表达式匹配 {{variable}} 格式
        // \w+(?:\.\w+)* 匹配变量名，支持点号分隔的嵌套属性
        return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, key) => {
            const value = this.getVariableValue(key, context)
            // 如果变量值为 undefined 或 null，保留原字符串
            return value !== undefined && value !== null ? String(value) : match
        })
    }

    /**
     * 获取变量值
     * 
     * 从事件上下文中获取指定变量的值
     * 支持嵌套属性访问，如 "component.props.text"
     * 
     * @param key - 变量名，支持点号分隔的嵌套属性路径
     * @param context - 事件上下文
     * @returns 变量值，如果不存在返回 undefined
     * 
     * @example
     * getVariableValue("componentId", context) // 返回: 123
     * getVariableValue("component.props.text", context) // 返回组件属性中的 text 值
     */
    private getVariableValue(key: string, context: EventContext): unknown {
        // 将点号分隔的路径拆分为数组
        const keys = key.split('.')
        let value: unknown = context

        // 逐级访问属性
        for (const k of keys) {
            // 如果中间某个属性为 null 或 undefined，返回 undefined
            if (value === null || value === undefined) {
                return undefined
            }
            // 访问下一级属性
            value = (value as Record<string, unknown>)[k]
        }

        return value
    }
}

// 导出单例实例，整个应用共享同一个事件执行引擎
export const eventExecutor = new EventExecutor()

