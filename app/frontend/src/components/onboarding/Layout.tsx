import type { JSX } from "react"
import AppLogo from "../AppLogo"

type TLayoutProps = {
  step: {
    name: string
    value: number
  }
  banner: {
    title: string
    description: string
  }
  content: {
    title: string
    description: string
    children: JSX.Element
  }
  onContinue: () => void
  onBack?: () => void
  continueDisabled?: boolean
}

const Layout = ({
  step,
  banner,
  content,
  onContinue,
  onBack,
  continueDisabled = false,
}: TLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      <div className="w-[400px] bg-gradient-to-br from-indigo-400 from-5% via-teal-300 via-25% to-orange-300 to-80% flex flex-col text-center p-3">
        <AppLogo style="p-1" />
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-4">{banner.title}</h1>
          <p className="text-md">{banner.description}</p>
        </div>
      </div>

      <div className="flex-1 bg-white flex flex-col px-15 py-10">
        <div className="">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Step {step.value} of 3</span>
            <span className="text-sm text-gray-600">{step.name}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`bg-black h-2 rounded-full ${step.value === 1 ? "w-1/3" : step.value === 2 ? "w-2/3" : "w-3/3"} transition-all duration-300`}
            ></div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-10 items-center mt-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-1">{content.title}</h2>
            <p>{content.description}</p>
          </div>

          <div className="flex-1 w-full flex justify-center items-center">{content.children}</div>

          <div className="max-w-[400px] w-full flex justify-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex-1 border-1 border-black py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium disabled:opacity-60 hover:cursor-pointer"
              >
                BACK
              </button>
            )}
            <button
              disabled={continueDisabled}
              onClick={onContinue}
              className="flex-1 bg-black text-white py-3 px-4 rounded-md  transition-colors font-medium disabled:opacity-60 enabled:hover:bg-gray-800 enabled:hover:cursor-pointer"
            >
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
