import { Typography } from 'antd'
import type { CommonComponentProps } from '../../interface'

const { Title: AntdTitle } = Typography

export default function Title({ level, text, styles }: CommonComponentProps) {
    return (
        <AntdTitle
            level={level || 1}
            style={styles}
        >
            {text || '标题'}
        </AntdTitle>
    )
}

