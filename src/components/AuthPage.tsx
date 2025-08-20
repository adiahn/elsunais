import React, { useState } from 'react';
import { User, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  onLogin: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin();
    } else {
      alert('Password reset link sent to your email!');
      setIsLogin(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background with night landscape */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-blue-800 to-teal-900">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
          {/* Brighter stars */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`bright-${i}`}
              className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1.5 + Math.random() * 1}s`
              }}
            />
          ))}
        </div>
        
        {/* Mountains */}
        <div className="absolute bottom-0 left-0 right-0 h-64">
          <div className="absolute bottom-0 left-0 w-full h-full">
            {/* Back mountains */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-950 to-transparent transform -skew-y-6 origin-bottom-left"></div>
            <div className="absolute bottom-0 right-0 w-full h-40 bg-gradient-to-t from-blue-900 to-transparent transform skew-y-6 origin-bottom-right"></div>
            
            {/* Front mountains */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-teal-950 to-transparent transform -skew-y-3 origin-bottom-left"></div>
            <div className="absolute bottom-0 right-0 w-full h-56 bg-gradient-to-t from-teal-900 to-transparent transform skew-y-3 origin-bottom-right"></div>
          </div>
        </div>
        
        {/* Pine trees silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-32">
          {[...Array(20)].map((_, i) => (
            <div
              key={`tree-${i}`}
              className="absolute bottom-0 w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-teal-950"
              style={{
                left: `${Math.random() * 100}%`,
                height: `${20 + Math.random() * 20}px`,
                borderLeftWidth: `${3 + Math.random() * 3}px`,
                borderRightWidth: `${3 + Math.random() * 3}px`,
                borderBottomWidth: `${6 + Math.random() * 4}px`
              }}
            />
          ))}
        </div>
      </div>

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-2xl p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-blue-100/20 border border-blue-300/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white/70"
                placeholder="Username"
                required
              />
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-blue-100/20 border border-blue-300/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white/70"
                placeholder="Password"
                required
              />
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-white text-sm">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 w-4 h-4 bg-blue-100/20 border border-blue-300/30 rounded focus:ring-2 focus:ring-blue-400"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-white text-blue-900 py-3 px-4 rounded-md font-semibold transition-all duration-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              Login
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                className="text-white font-semibold hover:underline transition-colors"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;