import { Input as AntdInput } from 'antd'
import type { CommonComponentProps } from '../../interface'

export default function Input({ placeholder, value, styles }: CommonComponentProps) {
    return (
        <AntdInput
            placeholder={placeholder}
            value={value}
            style={styles}
        />
    )
}

