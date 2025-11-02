'use client'

import { AlertCircle, AlertTriangle, Ban, Info } from 'lucide-react'

interface ErrorMessageProps {
  type: 'error' | 'warning' | 'info' | 'blocked'
  message: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ type, message }) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      case 'info':
        return <Info className="h-6 w-6 text-blue-500" />
      case 'blocked':
        return <Ban className="h-6 w-6 text-gray-500" />
      default:
        return null
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return 'bg-red-100'
      case 'warning':
        return 'bg-yellow-100'
      case 'info':
        return 'bg-blue-100'
      case 'blocked':
        return 'bg-gray-100'
      default:
        return 'bg-gray-100'
    }
  }

  return (
    <div className={`flex items-center p-4 mb-4 rounded-lg ${getBackgroundColor()}`}>
      <div className="flex-shrink-0 mr-4">{getIcon()}</div>
      <div className="flex-1 text-sm font-medium">{message}</div>
    </div>
  )
}

export default ErrorMessage

