import React, { useState, useEffect } from 'react'
import {
  ArrowRight,
  ExternalLink,
  Globe,
  Zap,
  Code,
  Sparkles,
} from 'lucide-react'
import Lanyard from '@/components/Lanyard'

const Landing: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [autoRedirect, setAutoRedirect] = useState(true)

  const oldDomain = 'https://pdc-jkind.github.io/'
  const newDomain = 'https://code-list-pdc.web.app'
  const developerName = 'Ryan Dev'

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (autoRedirect && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (autoRedirect && countdown === 0) {
      window.location.href = newDomain
    }
  }, [countdown, autoRedirect, newDomain])

  const handleRedirect = () => {
    window.open(newDomain, '_blank')
  }

  const toggleAutoRedirect = () => {
    setAutoRedirect(!autoRedirect)
    if (!autoRedirect) {
      setCountdown(10)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
      {/* Full Screen Lanyard Background - Behind Everything */}
      <div className="fixed inset-0 w-full h-full z-99 transform translate-x-1/4 -translate-y-16 scale-110">
        <Lanyard
          position={[0, 0, 20]}
          gravity={[0, -40, 0]}
          fov={25}
          transparent={true}
        />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-1">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content - Two Column Layout */}
      <div
        className={`relative z-10 flex items-center justify-center min-h-screen p-4 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Left Section - Content */}
            <div className="text-center lg:text-left lg:col-span-2">
              {/* Header Icon */}
              <div className="mb-1 flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center animate-spin">
                    <Sparkles className="w-2.5 h-2.5 text-yellow-900" />
                  </div>
                </div>
              </div>

              {/* Main Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                Domain Relocation
              </h1>

              {/* Subtitle */}
              <p className="text-base md:text-lg text-gray-300 mb-2 leading-relaxed">
                We've moved to a better home! 🚀
              </p>

              {/* Migration Info Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 mb-2 border border-white/20 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                  {/* Old Domain */}
                  <div className="text-center">
                    <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Code className="w-5 h-5 text-red-400" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-1">
                      Old Domain
                    </h3>
                    <p className="text-gray-400 text-xs break-all">
                      {oldDomain}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* New Domain */}
                  <div className="text-center">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Zap className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-1">
                      New Domain
                    </h3>
                    <p className="text-gray-400 text-xs break-all">
                      {newDomain}
                    </p>
                  </div>
                </div>
              </div>

              {/* Developer Info */}
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-3 mb-2 border border-white/10">
                <p className="text-sm text-white text-center">
                  Developed with ❤️ by{' '}
                  <span className="font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {developerName}
                  </span>
                </p>
              </div>

              {/* Auto Redirect Section */}
              {autoRedirect && (
                <div className="bg-yellow-500/20 backdrop-blur-lg rounded-2xl p-3 mb-2 border border-yellow-500/30">
                  <p className="text-white text-sm mb-2">
                    Redirecting automatically in{' '}
                    <span className="font-bold text-yellow-400 text-lg">
                      {countdown}
                    </span>{' '}
                    seconds...
                  </p>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-1000 ease-linear"
                      style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center">
                <button
                  onClick={handleRedirect}
                  className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2.5 px-5 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <span className="text-sm">Visit New Site</span>
                  <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                </button>

                <button
                  onClick={toggleAutoRedirect}
                  className={`py-2.5 px-5 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm ${
                    autoRedirect
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                      : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                  }`}
                >
                  {autoRedirect
                    ? 'Cancel Auto Redirect'
                    : 'Enable Auto Redirect'}
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-2 text-gray-400 text-xs">
                <p>Please update your bookmarks to the new domain</p>
                <p className="text-xs text-gray-500 mt-1">
                  💡 Try dragging the lanyard card on the right!
                </p>
              </div>
            </div>

            {/* Right Section - Lanyard Placeholder Area */}
            <div className="flex justify-center lg:justify-end"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-500 text-xs z-20">
        <p>© 2025 {developerName}. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Landing
