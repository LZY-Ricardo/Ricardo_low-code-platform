import type { CommonComponentProps } from '../../interface'

export default function Page({ children, styles }: CommonComponentProps) {
    return (
        <div
            className='p-[20px] '
            style={styles}
        >
            {children}
        </div>
    )
}
