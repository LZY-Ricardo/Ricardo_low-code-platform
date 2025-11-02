import { Button as AntdButton } from 'antd'
import type { CommonComponentProps } from '../../interface'

export default function Button({ type, text, styles, onClick, onDoubleClick, onMouseEnter, onMouseLeave, ...rest }: CommonComponentProps) {
    return (
        <AntdButton
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
