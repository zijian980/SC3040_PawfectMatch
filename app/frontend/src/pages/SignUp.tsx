import { EyeOff, Eye } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"
import Loading from "@/components/Loading"
import { AuthAPI } from "@/api"
import AppLogo from "@/components/AppLogo"

type TSignUpForm = {
  firstName: string
  email: string
  password: string
  agree: boolean
}

export default function SignUp() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TSignUpForm>({
    defaultValues: {
      firstName: "",
      email: "",
      password: "",
      agree: false,
    },
    mode: "onBlur",
  })

  const onSubmit = async (data: TSignUpForm) => {
    try {
      const { firstName, ...restData } = data

      // Transform frontend data to match backend expectations
      const signupData = {
        first_name: firstName, // Map firstName to name
        email: restData.email,
        password: restData.password,
        // Provide placeholder values that will be updated later
        dob: "1990-01-01T00:00:00Z", // Placeholder DOB - will be updated later
        gender: "male" as const, // Placeholder gender - will be updated later
      }

      await AuthAPI.signup(signupData)
      // On successful signup, navigate to login page for now
      // Later this can redirect to DOB/gender collection page
      navigate("/login", { replace: true })
    } catch (err) {
      alert(err)
    }
  }

  return (
    <>
      <div className="auth-bg fixed inset-0 z-[-1] bg-gradient-to-br from-indigo-400 from-5% via-teal-300 via-25% to-orange-300 to-80%"></div>
      <div className="min-h-screen flex flex-col px-12">
        <header className="flex justify-between items-center pt-9">
          <AppLogo />
          <Link
            to="/login"
            className="px-6 py-2 border-2 border-black text-black font-bold text-sm hover:bg-black hover:text-white transition-colors"
          >
            SIGN IN
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl px-16 pt-14 pb-20 w-full max-w-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign up to PawfectMatch</h1>
              <p className="text-gray-600 text-sm">A simple way to take care for your pet</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  aria-invalid={!!errors.firstName}
                  className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:border-black ${
                    errors.firstName ? "border-red-500 focus:border-red-500" : "border-gray-300"
                  }`}
                  {...register("firstName", {
                    required: "First name is required",
                    minLength: {
                      value: 2,
                      message: "First name must be at least 2 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "First name should only contain letters and spaces",
                    },
                  })}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide"
                >
                  Email Address (Gmail only)
                </label>
                <input
                  id="email"
                  type="email"
                  aria-invalid={!!errors.email}
                  className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:border-black ${
                    errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300"
                  }`}
                  placeholder="yourname@gmail.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@gmail\.com$/,
                      message: "Please use a Gmail address (@gmail.com)",
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
                <p className="text-xs text-gray-500 mb-2">
                  Must contain: 8+ characters, uppercase, lowercase, number, and special character
                  (@$!%*?&)
                </p>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    aria-invalid={!!errors.password}
                    className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:border-black ${
                      errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300"
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      validate: {
                        hasLowercase: (value) =>
                          /[a-z]/.test(value) || "Password must contain a lowercase letter",
                        hasUppercase: (value) =>
                          /[A-Z]/.test(value) || "Password must contain an uppercase letter",
                        hasNumber: (value) => /\d/.test(value) || "Password must contain a digit",
                        hasSpecialChar: (value) =>
                          /[@$!%*?&]/.test(value) ||
                          "Password must contain a special character (@$!%*?&)",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-gray-300 rounded"
                    {...register("agree", {
                      required: "You must agree to the Terms of Service and Privacy Policy",
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the Terms of Service and Privacy Policy.
                  </span>
                </label>
              </div>
              {errors.agree && <p className="mt-1 text-sm text-red-600">{errors.agree.message}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-60"
              >
                {isSubmitting ? <Loading /> : "CREATE ACCOUNT"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
