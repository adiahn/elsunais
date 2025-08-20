import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ArrowLeft, Users, Globe } from 'lucide-react';

interface AuthPageProps {
  onLogin: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin();
    } else if (isForgotPassword) {
      alert('Password reset link sent to your email!');
      setIsForgotPassword(false);
      setIsLogin(true);
    }
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
    setIsLogin(false);
  };

  const handleBackToLogin = () => {
    setIsLogin(true);
    setIsForgotPassword(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Green Background with Welcome Message */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-green-500 to-green-700 relative overflow-hidden">
        {/* Decorative geometric shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-8 h-8 border-2 border-green-300/30 rotate-45"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-green-300/20 rotate-45"></div>
          <div className="absolute bottom-32 left-16 w-10 h-10 border-2 border-green-300/25 rotate-45"></div>
          <div className="absolute bottom-20 right-32 w-4 h-4 bg-green-300/30 rotate-45"></div>
          <div className="absolute top-64 right-16 w-6 h-6 border-2 border-green-300/20 rotate-45"></div>
          <div className="absolute bottom-64 left-40 w-8 h-8 bg-green-300/25 rotate-45"></div>
        </div>
        
        {/* Welcome Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center text-white px-8 w-full">
          {/* Brand Logo */}
          <div className="absolute top-8 left-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">ACReSAL</span>
          </div>
          
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-lg text-white/90 max-w-xs leading-relaxed">
              To keep connected with us please login with your personal info
            </p>
          </div>

          {/* Sign In Button (for visual balance) */}
          <div className="mt-6">
            <div className="inline-flex items-center justify-center px-6 py-2 border-2 border-white rounded-full text-white font-medium text-sm">
              SIGN IN
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo (only visible on mobile) */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-xl mb-4 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">ACReSAL</h1>
            <p className="text-green-600 text-sm">Project Management System</p>
          </div>

          {/* Form Section */}
          <div className="bg-white">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-green-700 mb-2">
                {isLogin ? 'Sign In' : 'Reset Password'}
              </h2>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Please sign in to your account' 
                  : 'Enter your email to receive a reset link'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Email"
                    required
                  />
                </div>
              </div>

              {isLogin && (
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Password"
                      required
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-full font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isLogin ? (
                  <>
                    SIGN IN
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            {!isLogin && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleBackToLogin}
                  className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors flex items-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-4 text-green-600">
              <Users className="w-4 h-4" />
              <Globe className="w-4 h-4" />
            </div>
            <p className="text-xs text-green-600 mt-2">
              © 2025 ACReSAL. Project Management System.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;