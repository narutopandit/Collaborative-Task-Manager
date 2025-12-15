
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../api/axios'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export default function Register() {
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: any) => {
    try {
      setErrorMsg('')
      await api.post('/auth/register', data)
      setSuccessMsg('Registered successfully! Redirecting to login...')
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Illustration Side */}
        <div className="hidden lg:flex justify-center items-center">
          <div className="text-center">
            <div className="mb-8">
              <svg className="w-32 h-32 mx-auto" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="90" stroke="#e0e7ff" strokeWidth="2" />
                <path d="M80 120 Q100 80 120 120" stroke="#6366f1" strokeWidth="3" fill="none" />
                <circle cx="85" cy="95" r="4" fill="#6366f1" />
                <circle cx="115" cy="95" r="4" fill="#6366f1" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Get Started</h2>
            <p className="text-gray-600">Join us and manage your tasks efficiently</p>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600 text-sm">Get started with our task management platform</p>
            </div>

            {/* Success Message */}
            {successMsg && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm font-medium">{successMsg}</p>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{errorMsg}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none ${
                    errors.name
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500 font-medium">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none ${
                    errors.email
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none ${
                    errors.password
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700 text-sm">
                  I agree to the{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Terms and Conditions
                  </a>
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-200"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
