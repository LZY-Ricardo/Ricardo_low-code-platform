import { Input as AntdInput } from 'antd'
import type { CommonComponentProps } from '../../interface'

export default function Input({ id, placeholder, value, styles }: CommonComponentProps) {
    return (
        <AntdInput
            data-component-id={id}
            placeholder={placeholder}
            value={value}
            style={styles}
            readOnly
        />
    )
}

