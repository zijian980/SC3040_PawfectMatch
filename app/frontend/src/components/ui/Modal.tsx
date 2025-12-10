import { X } from "lucide-react"
import { useState, forwardRef, useImperativeHandle, type ReactNode } from "react"

export type TModalHandle = {
  openModal: () => void
  closeModal: () => void
}

export type TModalProps = {
  header?: string
  children: ReactNode
  actionButtons: {
    label: string
    onClick: () => void
    variant?: "primary" | "secondary"
    style?: string
  }[]
}

const ButtonVariant = {
  primary: "bg-black text-white hover:bg-gray-500 ",
  secondary: "bg-white border border-black hover:bg-gray-500 hover:text-white",
}

const Modal = forwardRef<TModalHandle, TModalProps>(({ header, children, actionButtons }, ref) => {
  const [open, setOpen] = useState<boolean>(false)

  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }))

  return (
    open && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
            onClick={closeModal}
          >
            <X className="h-6 w-6" />
          </button>
          {header && <h2 className="text-xl font-bold mb-4">{header}</h2>}
          {children}
          <div className="mt-6 flex justify-end gap-3">
            {actionButtons.map(({ label, onClick, variant, style }, index) => (
              <button
                key={index}
                onClick={onClick}
                className={`px-4 py-2 rounded-md font-medium transition-colors hover:cursor-pointer ${ButtonVariant[variant ?? "primary"]} ${style ?? ""}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  )
})

export default Modal
