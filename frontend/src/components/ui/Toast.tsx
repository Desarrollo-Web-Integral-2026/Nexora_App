import { useEffect } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'

export interface ToastData {
  type: 'success' | 'error'
  message: string
}

interface ToastProps extends ToastData {
  onClose: () => void
}

// Criterio 7, 8 — notificación visual de éxito/error, sin detalles técnicos
function Toast({ type, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const isSuccess = type === 'success'

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl
        border backdrop-blur-xl shadow-lg animate-in fade-in slide-in-from-bottom-2
        ${isSuccess
          ? 'bg-green-500/10 border-green-500/30 text-green-400'
          : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}
    >
      {isSuccess ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
      <span className="text-sm text-white">{message}</span>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast