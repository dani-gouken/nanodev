import { PropsWithChildren } from "react"

type ButtonProps = {
    disabled?: boolean,
    loading?: boolean,
}
export function Button({
    disabled = false,
    loading = false,
    children
}: PropsWithChildren<ButtonProps>) {
    return (
        <button type="submit" disabled={disabled} className={`btn btn-primary ${loading ? "loading" : ""}`}>{children}</button>
    )
}
