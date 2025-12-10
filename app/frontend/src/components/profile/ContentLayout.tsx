import type { ReactNode } from "react"

type TContentLayoutProps = {
  title: string
  action: {
    label: string
    onClick: () => void
  }
  children: ReactNode
}

const ContentLayout = ({ title, action, children }: TContentLayoutProps) => {
  return (
    <div className="mt-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">{title}</h2>
        <button
          className="bg-black text-white py-2 px-4 rounded-md  transition-colors font-medium disabled:opacity-60 enabled:hover:bg-gray-800 enabled:hover:cursor-pointer"
          onClick={() => action.onClick()}
        >
          {action.label}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  )
}

export default ContentLayout
