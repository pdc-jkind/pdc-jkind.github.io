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
      // window.location.href = newDomain
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Full Screen Lanyard Background */}
      <div className="absolute inset-0 w-full h-full">
        <Lanyard
          position={[0, 0, 20]}
          gravity={[0, -40, 0]}
          fov={25}
          transparent={true}
        />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content - Centered Layout */}
      <div
        className={`relative z-10 flex items-center justify-center min-h-screen p-4 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center">
            {/* Header Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-spin">
                  <Sparkles className="w-3 h-3 text-yellow-900" />
                </div>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Domain Relocation
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              We've moved to a better home! 🚀
            </p>

            {/* Migration Info Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 border border-white/20 shadow-2xl max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Old Domain */}
                <div className="text-center">
                  <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Code className="w-7 h-7 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Old Domain
                  </h3>
                  <p className="text-gray-400 text-sm break-all px-2">
                    {oldDomain}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                    <ArrowRight className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* New Domain */}
                <div className="text-center">
                  <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-7 h-7 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    New Domain
                  </h3>
                  <p className="text-gray-400 text-sm break-all px-2">
                    {newDomain}
                  </p>
                </div>
              </div>
            </div>

            {/* Developer Info */}
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/10 max-w-md mx-auto">
              <p className="text-lg text-white">
                Developed with ❤️ by{' '}
                <span className="font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {developerName}
                </span>
              </p>
            </div>

            {/* Auto Redirect Section */}
            {autoRedirect && (
              <div className="bg-yellow-500/20 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-yellow-500/30 max-w-md mx-auto">
                <p className="text-white text-lg mb-4">
                  Redirecting automatically in{' '}
                  <span className="font-bold text-yellow-400 text-2xl">
                    {countdown}
                  </span>{' '}
                  seconds...
                </p>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={handleRedirect}
                className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 text-lg"
              >
                Visit New Site
                <ExternalLink className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              </button>

              <button
                onClick={toggleAutoRedirect}
                className={`py-4 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 text-lg ${
                  autoRedirect
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                    : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                }`}
              >
                {autoRedirect ? 'Cancel Auto Redirect' : 'Enable Auto Redirect'}
              </button>
            </div>

            {/* Additional Info */}
            <div className="text-gray-400 text-base space-y-2">
              <p>This page will remain active for backward compatibility</p>
              <p>Please update your bookmarks to the new domain</p>
              <p className="text-sm text-gray-500 mt-4">
                💡 Try dragging the lanyard card above!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm z-20">
        <p>© 2025 {developerName}. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Landing
