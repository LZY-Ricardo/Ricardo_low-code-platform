import { Input as AntdInput } from 'antd'
import type { CommonComponentProps } from '../../interface'

export default function Input({ id, placeholder, value, styles, onClick, onChange, onFocus, onBlur, ...rest }: CommonComponentProps) {
    return (
        <AntdInput
            id={id !== undefined && id !== null ? String(id) : undefined}
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

