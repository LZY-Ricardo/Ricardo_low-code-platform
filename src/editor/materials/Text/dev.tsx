import type { CommonComponentProps } from '../../interface'

export default function Text({ id, text, styles }: CommonComponentProps) {
    return (
        <span data-component-id={id} style={styles}>
            {text || '文本内容'}
        </span>
    )
}

