import { forwardRef } from "react"
import Modal, { type TModalHandle } from "./Modal"
import { CircleX } from "lucide-react"

type TDeleteModalProps = {
  onConfirm: () => void
  onCancel: () => void
}

const DeleteModal = forwardRef<TModalHandle, TDeleteModalProps>(({ onConfirm, onCancel }, ref) => {
  return (
    <Modal
      ref={ref}
      header="Confirm Delete"
      actionButtons={[
        {
          label: "Cancel",
          onClick: () => onCancel(),
          variant: "secondary",
        },
        {
          label: "Delete",
          onClick: () => onConfirm(),
          style: "!bg-red-500",
        },
      ]}
    >
      <div className="flex flex-col p-4 text-center gap-5">
        <CircleX className="text-red-500 w-24 h-24 m-auto" />
        <p className=" text-2xl font-bold text-gray-600">Are you sure?</p>
        <p className="text-sm text-gray-500">
          Do you really want to delete? This action cannot be undone.
        </p>
      </div>
    </Modal>
  )
})

export default DeleteModal
