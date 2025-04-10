import axios from "axios";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import validator from "validator";

/**
 * SigninPage Component
 *
 * A modern, responsive sign-in page with dark theme styling.
 * Handles user authentication through form submission to a backend API.
 * Features:
 * - Modern UI with glass morphism
 * - Form validation using validator.js
 * - Password visibility toggle
 * - Loading state feedback
 * - Icon integration
 */
const SigninPage: React.FC = () => {
  // State for form input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  /**
   * Validates form input using validator.js
   * @returns boolean indicating if form is valid
   */
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    // Validate email
    if (!validator.isEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate password
    if (!validator.isLength(password, { min: 6 })) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Form submission handler
   * Validates and sends credentials to backend for authentication
   * @param e - Form submission event
   */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Send authentication request to backend
      const result = await axios.post(
        `http://localhost:3000/api/signin`,
        { email, password },
        {
          withCredentials: true, // Important for cookie-based auth
        }
      );
      console.log("Sign-in successful:", result.data);

      // Handle successful sign-in
      setIsLoading(false);
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      // Handle authentication errors
      console.error("Sign-in failed:", error);
      setIsLoading(false);
      alert("Sign-in failed. Please check your credentials.");
    }
  };

  return (
    // Main container with modern gradient background and full viewport height
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 p-4">
      {/* Card container with enhanced glass morphism effect */}
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-lg bg-gray-900/70 border border-gray-700/50">
        {/* Brand logo placeholder */}
        <div className="mb-8 text-center">
          <div className="mx-auto w-16 h-16 mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Welcome Back
          </h2>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Email input field with icon and validation */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-500" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => {
                  if (email) {
                    setErrors({
                      ...errors,
                      email: validator.isEmail(email)
                        ? undefined
                        : "Please enter a valid email address",
                    });
                  }
                }}
                required
                className="w-full p-3 pl-10 rounded-lg bg-gray-800/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password input field with icon, toggle visibility, and validation */}
          <div>
            <div className="flex justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => {
                  if (password) {
                    setErrors({
                      ...errors,
                      password: validator.isLength(password, { min: 6 })
                        ? undefined
                        : "Password must be at least 6 characters",
                    });
                  }
                }}
                required
                className="w-full p-3 pl-10 pr-10 rounded-lg bg-gray-800/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Submit button with enhanced styling and loading state */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center p-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Sign up link with enhanced styling */}
        <p className="text-sm text-gray-400 text-center mt-8">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
};

export default SigninPage;
