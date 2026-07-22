import type { ReactNode } from 'react'

type LeaveActionVariant =
    | 'approve'
    | 'reject'
    | 'cancel'

type LeaveActionButtonProps = {
    variant: LeaveActionVariant
    onClick: () => void
    children: ReactNode
    disabled?: boolean
    isLoading?: boolean
}

function LeaveActionButton({
                               variant,
                               onClick,
                               children,
                               disabled = false,
                               isLoading = false,
                           }: LeaveActionButtonProps) {
    const variantClasses: Record<
        LeaveActionVariant,
        string
    > = {
        approve:
            'border-green-300 bg-green-50 text-green-700 hover:bg-green-100',

        reject:
            'border-red-300 bg-red-50 text-red-700 hover:bg-red-100',

        cancel:
            'border-slate-300 bg-white text-slate-700 hover:bg-slate-100',
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`
                cursor-pointer rounded-lg border px-3 py-1.5
                text-xs font-semibold transition-colors
                disabled:cursor-not-allowed disabled:opacity-50
                ${variantClasses[variant]}
            `}
        >
            {isLoading ? 'Processing...' : children}
        </button>
    )
}

export default LeaveActionButton