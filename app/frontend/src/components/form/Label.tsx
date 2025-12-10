type TLabelProps = {
  htmlFor: string
  text: string
}

const Label = ({ htmlFor, text }: TLabelProps) => (
  <label
    htmlFor={htmlFor}
    className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide"
  >
    {text}
  </label>
)

export default Label
