import type { CommonComponentProps } from '../../interface'

export default function Text({ text, styles }: CommonComponentProps) {
    return (
        <span style={styles}>
            {text || '文本内容'}
        </span>
    )
}

