/**
 * 组件事件配置面板
 * 
 * 提供可视化的界面用于配置组件的事件处理
 * 用户可以：
 * - 为组件添加/删除事件
 * - 选择事件触发后执行的动作类型
 * - 配置动作的具体参数
 * 
 * 工作流程：
 * 1. 根据组件类型显示支持的事件列表
 * 2. 用户选择事件并配置动作
 * 3. 配置保存到组件的 events 属性中
 * 4. 在预览模式下，事件会自动绑定并执行
 */
import { useState, useEffect } from 'react'
import { Form, Select, Input, InputNumber, Button, Card, Typography } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { useComponentsStore } from '../../stores/components'
import type { ComponentEvent, EventType, ActionType } from '../../types/event'

const { Text } = Typography

/**
 * 组件支持的事件类型映射
 * 不同的组件类型支持不同的事件
 * 例如：Button 支持点击事件，Input 支持 onChange 事件
 */
const AVAILABLE_EVENTS: { [componentName: string]: EventType[] } = {
    Button: ['onClick', 'onDoubleClick', 'onMouseEnter', 'onMouseLeave'],
    Input: ['onClick', 'onChange', 'onFocus', 'onBlur'],
    Image: ['onClick', 'onDoubleClick', 'onMouseEnter', 'onMouseLeave'],
    Container: ['onClick', 'onDoubleClick'],
    Card: ['onClick', 'onDoubleClick'],
    Text: ['onClick', 'onDoubleClick'],
    Title: ['onClick', 'onDoubleClick'],
    Page: [],
}

/**
 * 动作类型选项
 * 定义用户可以选择的动作类型
 */
const ACTION_TYPES: { label: string; value: ActionType }[] = [
    { label: '显示消息', value: 'showMessage' },
    { label: '页面跳转', value: 'navigate' },
    { label: '更新组件状态', value: 'setState' },
    { label: '调用 API', value: 'callAPI' },
    { label: '自定义脚本', value: 'customScript' },
]

/**
 * 消息类型选项
 * 用于 showMessage 动作的消息类型选择
 */
const MESSAGE_TYPES = [
    { label: '成功', value: 'success' },
    { label: '错误', value: 'error' },
    { label: '警告', value: 'warning' },
    { label: '信息', value: 'info' },
]

export default function ComponentEvent() {
    const [form] = Form.useForm()
    const { curComponentId, curComponent, updateComponentEvents } = useComponentsStore()
    /** 当前组件已配置的事件 */
    const [selectedEvents, setSelectedEvents] = useState<Record<string, ComponentEvent>>({})

    /** 获取当前组件支持的事件类型 */
    const availableEvents = curComponent ? (AVAILABLE_EVENTS[curComponent.name] || []) : []

    /**
     * 当选中组件变化时，回显组件的事件配置
     * 将组件的事件配置同步到表单和本地状态
     */
    useEffect(() => {
        if (curComponent?.events) {
            // 同步事件配置到本地状态
            setSelectedEvents(curComponent.events)

            // 回显表单数据
            // 表单字段命名规则：{eventType}_{fieldName}
            // 例如：onClick_actionType, onClick_content 等
            const formData: Record<string, unknown> = {}
            Object.entries(curComponent.events).forEach(([eventType, event]) => {
                formData[`${eventType}_actionType`] = event.actionType
                Object.entries(event.actionConfig).forEach(([key, value]) => {
                    formData[`${eventType}_${key}`] = value
                })
            })
            form.setFieldsValue(formData)
        } else {
            // 如果没有事件配置，清空状态和表单
            setSelectedEvents({})
            form.resetFields()
        }
    }, [curComponent, form])

    if (!curComponent || !curComponentId) {
        return (
            <div className="text-center text-text-secondary py-8">
                请先选择一个组件
            </div>
        )
    }

    if (availableEvents.length === 0) {
        return (
            <div className="text-center text-text-secondary py-8">
                该组件暂不支持事件配置
            </div>
        )
    }

    /**
     * 添加事件配置
     * 
     * 为指定的事件类型添加默认的事件配置
     * 默认动作为"显示消息"，并设置默认的消息内容
     * 
     * @param eventType - 要添加的事件类型
     */
    const handleAddEvent = (eventType: EventType) => {
        // 创建默认的事件配置
        const newEvent: ComponentEvent = {
            eventType,
            actionType: 'showMessage',  // 默认动作类型
            actionConfig: {
                type: 'success',
                content: '操作成功',
                duration: 3,
            },
        }

        // 更新本地状态和 store
        const updated = { ...selectedEvents, [eventType]: newEvent }
        setSelectedEvents(updated)
        updateComponentEvents(curComponentId, updated)

        // 设置表单默认值，使配置表单立即显示
        form.setFieldsValue({
            [`${eventType}_actionType`]: 'showMessage',
            [`${eventType}_type`]: 'success',
            [`${eventType}_content`]: '操作成功',
            [`${eventType}_duration`]: 3,
        })
    }

    /**
     * 删除事件配置
     * 
     * 移除指定事件类型的配置
     * 同时清除表单中相关的字段
     * 
     * @param eventType - 要删除的事件类型
     */
    const handleRemoveEvent = (eventType: EventType) => {
        // 从本地状态中移除事件
        const updated = { ...selectedEvents }
        delete updated[eventType]
        setSelectedEvents(updated)
        updateComponentEvents(curComponentId, updated)

        // 清除表单中该事件相关的所有字段
        const fieldsToRemove: string[] = []
        Object.keys(form.getFieldsValue()).forEach(key => {
            if (key.startsWith(`${eventType}_`)) {
                fieldsToRemove.push(key)
            }
        })
        form.setFieldsValue(
            fieldsToRemove.reduce((acc, key) => ({ ...acc, [key]: undefined }), {})
        )
    }

    /**
     * 事件配置变化处理
     * 
     * 当用户修改事件配置时调用
     * 支持修改动作类型和动作配置参数
     * 
     * @param eventType - 事件类型
     * @param field - 要修改的字段名（'actionType' 或配置项字段名）
     * @param value - 新值
     */
    const handleEventChange = (eventType: EventType, field: string, value: unknown) => {
        // 获取或创建事件配置
        const event = selectedEvents[eventType] || {
            eventType,
            actionType: 'showMessage',
            actionConfig: {},
        }

        if (field === 'actionType') {
            // 切换动作类型时，重置为对应动作类型的默认配置
            const defaultConfigs: Record<ActionType, Record<string, unknown>> = {
                showMessage: { type: 'success', content: '操作成功', duration: 3 },
                navigate: { url: '', openInNewTab: false },
                setState: { componentId: '', props: {} },
                callAPI: { url: '', method: 'GET', params: {} },
                customScript: { script: '' },
            }
            event.actionType = value as ActionType
            event.actionConfig = defaultConfigs[value as ActionType]
        } else {
            // 更新动作配置中的某个字段
            event.actionConfig[field] = value
        }

        // 同步更新到本地状态和 store
        const updated = { ...selectedEvents, [eventType]: event }
        setSelectedEvents(updated)
        updateComponentEvents(curComponentId, updated)
    }

    /**
     * 渲染动作配置表单
     * 
     * 根据动作类型渲染相应的配置表单
     * 不同动作类型需要不同的配置项
     * 
     * @param eventType - 事件类型
     * @param event - 事件配置对象
     * @returns 返回对应动作类型的配置表单 JSX
     */
    const renderActionConfig = (eventType: EventType, event: ComponentEvent) => {
        const { actionType, actionConfig } = event

        // 根据动作类型渲染不同的配置表单
        switch (actionType) {
            case 'showMessage':
                return (
                    <>
                        <Form.Item label="消息类型" name={`${eventType}_type`}>
                            <Select
                                value={actionConfig.type as string}
                                onChange={(value) => handleEventChange(eventType, 'type', value)}
                                options={MESSAGE_TYPES}
                            />
                        </Form.Item>
                        <Form.Item label="消息内容" name={`${eventType}_content`}>
                            <Input
                                value={actionConfig.content as string}
                                onChange={(e) => handleEventChange(eventType, 'content', e.target.value)}
                                placeholder="请输入消息内容"
                            />
                        </Form.Item>
                        <Form.Item label="显示时长(秒)" name={`${eventType}_duration`}>
                            <InputNumber
                                value={actionConfig.duration as number}
                                onChange={(value) => handleEventChange(eventType, 'duration', value)}
                                min={1}
                                max={10}
                            />
                        </Form.Item>
                    </>
                )

            case 'navigate':
                return (
                    <>
                        <Form.Item label="跳转地址" name={`${eventType}_url`}>
                            <Input
                                value={actionConfig.url as string}
                                onChange={(e) => handleEventChange(eventType, 'url', e.target.value)}
                                placeholder="请输入 URL，如：/page/123"
                            />
                        </Form.Item>
                        <Form.Item label="新标签页打开" name={`${eventType}_openInNewTab`}>
                            <Select
                                value={actionConfig.openInNewTab ? 'true' : 'false'}
                                onChange={(value) => handleEventChange(eventType, 'openInNewTab', value === 'true')}
                                options={[
                                    { label: '是', value: 'true' },
                                    { label: '否', value: 'false' },
                                ]}
                            />
                        </Form.Item>
                    </>
                )

            case 'setState':
                return (
                    <>
                        <Form.Item label="目标组件ID" name={`${eventType}_componentId`}>
                            <InputNumber
                                value={actionConfig.componentId as number}
                                onChange={(value) => handleEventChange(eventType, 'componentId', value)}
                                placeholder="请输入组件ID"
                            />
                        </Form.Item>
                        <Form.Item label="属性配置(JSON)" name={`${eventType}_props`}>
                            <Input.TextArea
                                value={JSON.stringify(actionConfig.props || {}, null, 2)}
                                onChange={(e) => {
                                    try {
                                        const props = JSON.parse(e.target.value)
                                        handleEventChange(eventType, 'props', props)
                                    } catch {
                                        // 忽略 JSON 解析错误
                                    }
                                }}
                                placeholder='{"text": "新文本", "type": "primary"}'
                                rows={4}
                            />
                        </Form.Item>
                    </>
                )

            case 'callAPI':
                return (
                    <>
                        <Form.Item label="API 地址" name={`${eventType}_url`}>
                            <Input
                                value={actionConfig.url as string}
                                onChange={(e) => handleEventChange(eventType, 'url', e.target.value)}
                                placeholder="https://api.example.com/data"
                            />
                        </Form.Item>
                        <Form.Item label="请求方法" name={`${eventType}_method`}>
                            <Select
                                value={actionConfig.method as string}
                                onChange={(value) => handleEventChange(eventType, 'method', value)}
                                options={[
                                    { label: 'GET', value: 'GET' },
                                    { label: 'POST', value: 'POST' },
                                    { label: 'PUT', value: 'PUT' },
                                    { label: 'DELETE', value: 'DELETE' },
                                ]}
                            />
                        </Form.Item>
                    </>
                )

            case 'customScript':
                return (
                    <Form.Item label="自定义脚本" name={`${eventType}_script`}>
                        <Input.TextArea
                            value={actionConfig.script as string}
                            onChange={(e) => handleEventChange(eventType, 'script', e.target.value)}
                            placeholder="console.log('Hello World');"
                            rows={6}
                        />
                    </Form.Item>
                )

            default:
                return null
        }
    }

    return (
        <div className="space-y-4">
            <Text type="secondary" className="text-sm text-text-secondary">
                为组件配置事件处理，当用户交互时触发相应的动作
            </Text>

            {availableEvents.map((eventType) => {
                const event = selectedEvents[eventType]
                const isConfigured = !!event

                return (
                    <Card
                        key={eventType}
                        size="small"
                        title={
                            <div className="flex items-center justify-between">
                                <span>{eventType}</span>
                                {isConfigured ? (
                                    <Button
                                        type="text"
                                        danger
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleRemoveEvent(eventType)}
                                    >
                                        删除
                                    </Button>
                                ) : (
                                    <Button
                                        type="primary"
                                        size="small"
                                        icon={<PlusOutlined />}
                                        onClick={() => handleAddEvent(eventType)}
                                    >
                                        添加
                                    </Button>
                                )}
                            </div>
                        }
                    >
                        {isConfigured && (
                            <Form form={form} layout="vertical" className="mt-4">
                                <Form.Item label="动作类型" name={`${eventType}_actionType`}>
                                    <Select
                                        value={event.actionType}
                                        onChange={(value) => handleEventChange(eventType, 'actionType', value)}
                                        options={ACTION_TYPES}
                                    />
                                </Form.Item>

                                {renderActionConfig(eventType, event)}
                            </Form>
                        )}
                    </Card>
                )
            })}
        </div>
    )
}
