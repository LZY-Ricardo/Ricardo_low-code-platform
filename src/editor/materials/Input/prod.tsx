import { Input as AntdInput } from 'antd'
import type { CommonComponentProps } from '../../interface'

export default function Input({ placeholder, value, styles, onClick, onChange, onFocus, onBlur, ...rest }: CommonComponentProps) {
    return (
        <AntdInput
            placeholder={placeholder}
            value={value}
            style={styles}
            onClick={onClick}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            {...rest}
        />
    )
}

