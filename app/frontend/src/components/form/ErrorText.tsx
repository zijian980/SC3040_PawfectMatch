import type { FieldError } from "react-hook-form"

type TErrorTextProps = {
  error: FieldError | undefined
}

const ErrorText = ({ error }: TErrorTextProps) => (
  <>{error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}</>
)

export default ErrorText
