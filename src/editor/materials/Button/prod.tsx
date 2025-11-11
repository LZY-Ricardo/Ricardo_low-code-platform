import { Button as AntdButton } from 'antd'
import type { CommonComponentProps } from '../../interface'

export default function Button({ id, type, text, styles, onClick, onDoubleClick, onMouseEnter, onMouseLeave, ...rest }: CommonComponentProps) {
    return (
        <AntdButton
            id={id !== undefined && id !== null ? String(id) : undefined}
            type={type}
            style={styles}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            {...rest}
        >
            {text}
        </AntdButton>
    )
}
