import React, { useState } from "react";
import axios from "axios";
import validator from "validator";

/**
 * SignupPage Component
 * A modern signup page with avatar selection and streamlined validation
 * Features a responsive left-right split layout on larger screens
 * Uses validator.js for robust input validation
 */
const SignupPage: React.FC = () => {
  // Avatar selection state
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000).toString());
  const [selectedAvatar, setSelectedAvatar] = useState("");

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form field states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Generates a new random avatar by updating the seed
   */
  function generateRandomAvatar() {
    const newSeed = Math.floor(Math.random() * 10000).toString();
    setSeed(newSeed);
    // Automatically deselect previous avatar when generating new one
    setSelectedAvatar("");
  }

  /**
   * Selects the currently displayed avatar for signup
   */
  function selectAvatar() {
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    setSelectedAvatar(avatarUrl);
  }

  /**
   * Validates all form inputs using validator.js
   * @returns {boolean} Whether all inputs are valid
   */
  const validateInputs = (): boolean => {
    // Check if avatar is selected
    if (!selectedAvatar) {
      setError("Please select an avatar first");
      return false;
    }

    // Validate name (no empty/whitespace only names)
    if (validator.isEmpty(name.trim())) {
      setError("Please enter a valid name");
      return false;
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Validate password strength
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      setError(
        "Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number"
      );
      return false;
    }

    return true;
  };

  /**
   * Validates form data and submits signup request
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run validation checks
    if (!validateInputs()) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(`http://localhost:3000/api/signup`, {
        name: validator.trim(name),
        email: validator.normalizeEmail(email),
        password,
        avatarUrl: selectedAvatar,
      });

      // Handle successful signup
      console.log("Signup successful:", response.data);

      // Redirect to login page or dashboard
      // window.location.href = '/dashboard';
    } catch (err: any) {
      // Handle signup error
      console.error("Signup error:", err);
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl flex flex-col md:flex-row">
        {/* Left side - Avatar selection and brand information */}
        <div className="bg-gradient-to-br from-blue-900 to-purple-900 p-8 md:w-2/5 flex flex-col justify-center items-center space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Join Our Community
            </h1>
            <p className="text-blue-200 text-sm">
              Create your account and start your journey
            </p>
          </div>

          {/* Avatar Selection Area */}
          <div className="w-full">
            <h3 className="text-xl text-white text-center mb-4">
              Choose Your Avatar
            </h3>

            <div className="flex justify-center mb-6">
              <div className="relative group">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                  alt="Avatar"
                  className="w-36 h-36 rounded-full border-4 border-gray-700 transition-transform group-hover:scale-105"
                />
                {selectedAvatar && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Selected
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center space-x-3">
              <button
                type="button"
                onClick={generateRandomAvatar}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm transition-colors"
              >
                Random Avatar
              </button>
              <button
                type="button"
                onClick={selectAvatar}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
              >
                Use This Avatar
              </button>
            </div>
          </div>

          {/* Features or benefits */}
          <div className="mt-8 text-center hidden md:block">
            <p className="text-blue-200 text-sm mb-3">Why join us?</p>
            <ul className="text-white text-sm space-y-2">
              <li>• Personalized experience</li>
              <li>• Connect with others</li>
              <li>• Access exclusive content</li>
            </ul>
          </div>
        </div>

        {/* Right side - Signup form */}
        <div className="p-8 md:w-3/5">
          <h2 className="text-3xl font-bold text-white text-center md:text-left mb-6">
            Sign Up
          </h2>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm text-gray-400 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-400 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  email && !validator.isEmail(email)
                    ? "border border-red-500"
                    : ""
                }`}
                placeholder="Enter your email"
              />
              {email && !validator.isEmail(email) && (
                <p className="text-red-400 text-xs mt-1">
                  Please enter a valid email address
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm text-gray-400 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  password && password.length < 8 ? "border border-red-500" : ""
                }`}
                placeholder="Create a strong password"
              />
              <div className="grid grid-cols-4 gap-2 mt-2">
                <p
                  className={`text-xs ${
                    password.length >= 8 ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  ✓ 8+ characters
                </p>
                <p
                  className={`text-xs ${
                    /[A-Z]/.test(password) ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  ✓ 1 uppercase letter
                </p>
                <p
                  className={`text-xs ${
                    /[a-z]/.test(password) ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  ✓ 1 lowercase letter
                </p>
                <p
                  className={`text-xs ${
                    /[0-9]/.test(password) ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  ✓ 1 number
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedAvatar || isSubmitting}
              className={`w-full p-3 rounded-lg transition-all mt-6 ${
                selectedAvatar && !isSubmitting
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
            >
              {isSubmitting
                ? "Creating Account..."
                : selectedAvatar
                ? "Create Account"
                : "Select an Avatar First"}
            </button>
          </form>

          <p className="text-sm text-gray-400 text-center mt-6">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-blue-400 hover:underline transition-colors"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
