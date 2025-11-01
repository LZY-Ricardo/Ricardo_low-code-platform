import { Card as AntdCard } from 'antd'
import type { CommonComponentProps } from '../../interface'

export default function Card({ title, children, styles }: CommonComponentProps) {
    return (
        <AntdCard
            title={title || '卡片标题'}
            style={styles}
        >
            {children}
        </AntdCard>
    )
}

