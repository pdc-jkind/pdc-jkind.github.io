import React, { useState, useEffect } from 'react'
import {
  Home,
  ExternalLink,
  AlertTriangle,
  ArrowRight,
  Search,
  RefreshCw,
} from 'lucide-react'

const NotFound: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [glitchEffect, setGlitchEffect] = useState(false)

  const newDomain = 'https://code-list-pdc.web.app'
  const developerName = 'PDC Developer Team'

  useEffect(() => {
    setIsVisible(true)

    // Glitch effect animation
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true)
      setTimeout(() => setGlitchEffect(false), 200)
    }, 3000)

    return () => clearInterval(glitchInterval)
  }, [])

  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleVisitNewSite = () => {
    window.open(newDomain, '_blank')
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Error Symbols */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-red-500 opacity-20 font-bold text-2xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            {['404', '?', '!', 'X'][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>

      <div
        className={`relative z-10 flex items-center justify-center min-h-screen p-4 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Error Icon with Animation */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div
                className={`w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-200 ${
                  glitchEffect ? 'animate-bounce scale-110' : ''
                }`}
              >
                <AlertTriangle className="w-12 h-12 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
                <span className="text-xs font-bold text-yellow-900">!</span>
              </div>
            </div>
          </div>

          {/* 404 Title with Glitch Effect */}
          <h1
            className={`text-6xl md:text-8xl font-bold text-white mb-4 transition-all duration-200 ${
              glitchEffect ? 'text-red-500 scale-105' : ''
            }`}
          >
            <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              4🔍4
            </span>
          </h1>

          {/* Error Message */}
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            Oops! Page Not Found
          </h2>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            The page you're looking for doesn't exist here anymore. We've
            recently moved to a new domain!
          </p>

          {/* Migration Info Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Search className="w-8 h-8 text-gray-400" />
              <h3 className="text-xl font-semibold text-white">
                Looking for our content?
              </h3>
            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30">
              <p className="text-white text-lg mb-4">
                We've moved everything to our new domain:
              </p>
              <div className="flex items-center justify-center gap-3 bg-black/20 rounded-xl p-4">
                <code className="text-green-400 text-lg font-mono break-all">
                  {newDomain}
                </code>
                <ArrowRight className="w-5 h-5 text-blue-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <button
              onClick={handleGoHome}
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Go Home
            </button>

            <button
              onClick={handleVisitNewSite}
              className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Visit New Site
            </button>

            <button
              onClick={handleRefresh}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
              Refresh
            </button>
          </div>

          {/* Developer Info */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-600/30">
            <p className="text-gray-300">
              Need help? Contact{' '}
              <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {developerName}
              </span>
            </p>
          </div>

          {/* Fun Fact */}
          <div className="mt-8 text-gray-400 text-sm">
            <p className="mb-2">
              💡 Fun fact: HTTP 404 errors were named after room 404 at CERN
            </p>
            <p>where the World Wide Web was born!</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm">
        <p>
          © 2025 {developerName}. This old domain is still maintained for
          compatibility.
        </p>
      </div>

      {/* CSS for additional animations */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default NotFound
