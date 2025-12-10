import { EyeOff, Eye } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import Loading from "@/components/Loading"
import { AuthAPI, OnboardingAPI } from "@/api"
import AppLogo from "@/components/AppLogo"
import { useUser } from "@/context/UserContext"

type TLoginForm = {
  email: string
  password: string
  rememberMe: boolean
}

const Login = () => {
  const navigate = useNavigate()
  const { fetchProfile } = useUser()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginForm>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onBlur",
  })

  const onSubmit = async ({ email, password }: TLoginForm) => {
    await AuthAPI.login({ email, password })
      .then(
        async () =>
          await OnboardingAPI.fetchOnboardingStatus()
            .then(({ onboarded }) => {
              if (onboarded) fetchProfile()
              navigate(onboarded ? "/dashboard" : "/onboarding", { replace: true })
            })
            .catch((err) => alert(err.message)),
      )
      .catch((err) => alert(err.message))
  }

  useEffect(() => {
    AuthAPI.isAuthenticated().then(({ authenticated }) => {
      if (authenticated) navigate("/onboarding", { replace: true })
    })
  }, [])

  return (
    <>
      <div className="auth-bg fixed inset-0 z-[-1] bg-gradient-to-br from-indigo-400 from-5% via-teal-300 via-25% to-orange-300 to-80%"></div>
      <div className="min-h-screen flex flex-col px-12">
        <header className="flex justify-between items-center pt-9">
          <AppLogo />
          <Link
            to="/signup"
            className="px-6 py-2 border-2 border-black text-black font-bold text-sm hover:bg-black hover:text-white transition-colors hover:cursor-pointer"
          >
            SIGN UP
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl px-16 pt-14 pb-20 w-full max-w-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Login to PawfectMatch</h1>
              <p className="text-gray-600 text-sm">A simple way to take care for your pet</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  aria-invalid={!!errors.email}
                  className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:border-black ${
                    errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300"
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    aria-invalid={!!errors.password}
                    className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:border-black ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("password", { required: "Password is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-gray-300 rounded"
                    {...register("rememberMe")}
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember Me</span>
                </label>
                <a href="#" className="text-sm text-gray-600 underline hover:text-gray-800">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-60 hover:cursor-pointer"
              >
                {isSubmitting ? <Loading /> : "PROCEED"}
              </button>
            </form>

            <div className="my-8 flex items-center">
              <div className="flex-grow border-t border-gray-300" />
              <span className="mx-4 text-sm">OR USE</span>
              <div className="flex-grow border-t border-gray-300" />
            </div>

            <div className=" flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => AuthAPI.loginGoogle()}
                className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-[50%] hover:bg-gray-200 hover:cursor-pointer"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-6 h-6"
                />
              </button>
              <button className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-[50%] hover:bg-gray-200 hover:cursor-pointer">
                <img
                  src="https://www.svgrepo.com/show/511330/apple-173.svg"
                  alt="Apple"
                  className="w-6 h-6"
                />
              </button>
              <button className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-[50%] hover:bg-gray-200 hover:cursor-pointer">
                <img
                  src="https://www.svgrepo.com/show/452196/facebook-1.svg"
                  alt="Facebook"
                  className="w-6 h-6"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
