const AppLogo = ({ style }: { style?: string }) => (
  <div className={`flex items-center gap-3 ${style ?? ""}`}>
    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
      <span className="text-white font-bold text-xl">PM</span>
    </div>
    <span className="text-gray-800 font-medium text-xl">PawfectMatch</span>
  </div>
)

export default AppLogo
