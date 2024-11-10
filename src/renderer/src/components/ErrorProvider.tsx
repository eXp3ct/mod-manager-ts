import React, { createContext, useContext, useCallback, useState } from 'react'
import { X } from 'lucide-react'

// Типы ошибок
export type ErrorType = 'CRITICAL' | 'DEV_ONLY' | 'SILENT'

// Интерфейс для ошибки
interface ErrorNotification {
  id: string
  title: string
  message: string
  type: ErrorType
}

// Интерфейс для логирования ошибок
interface ErrorLogOptions {
  type: ErrorType
  error?: Error | unknown
  details?: Record<string, unknown>
}

// Контекст для управления ошибками
interface ErrorContextType {
  showError: (title: string, message: string, type?: ErrorType) => void
  clearError: (id: string) => void
  logError: (title: string, message: string, options?: ErrorLogOptions) => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

// Компонент уведомления об ошибке
const ErrorAlert = ({
  error,
  onClose
}: {
  error: ErrorNotification
  onClose: (id: string) => void
}): JSX.Element => {
  return (
    <div
      className="bg-red-500 text-white rounded-lg shadow-lg p-4 mb-2 min-w-[320px] max-w-md animate-slide-in"
      role="alert"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-bold text-sm mb-1">{error.title}</h3>
          <p className="text-sm">{error.message}</p>
        </div>
        <button
          onClick={() => onClose(error.id)}
          className="ml-4 p-1 hover:bg-red-600 rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

// Провайдер контекста ошибок
export const ErrorProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [errors, setErrors] = useState<ErrorNotification[]>([])

  const showError = useCallback((title: string, message: string, type: ErrorType = 'CRITICAL') => {
    // Проверяем, нужно ли показывать ошибку
    if (type === 'DEV_ONLY' && process.env.NODE_ENV === 'production') {
      return
    }

    if (type === 'SILENT') {
      return
    }

    const newError: ErrorNotification = {
      id: (Math.random() * 100).toString(36).substr(2, 9),
      title,
      message,
      type
    }

    setErrors((prev) => [...prev, newError])

    // Автоматически удаляем ошибку через 5 секунд
    setTimeout(() => {
      clearError(newError.id)
    }, 5000)
  }, [])

  const clearError = useCallback((id: string) => {
    setErrors((prev) => prev.filter((error) => error.id !== id))
  }, [])

  // Функция для логирования ошибок
  const logError = useCallback(
    (
      message: string,
      title: string,
      { type = 'SILENT', error, details }: ErrorLogOptions = { type: 'SILENT' }
    ) => {
      // Всегда логируем в консоль для отладки
      console.error(message, { error, details })

      // Показываем уведомление в зависимости от типа
      showError(title, message, type)
    },
    [showError]
  )

  return (
    <ErrorContext.Provider value={{ showError, clearError, logError }}>
      <div className="fixed top-4 right-4 z-50 flex flex-col-reverse items-end">
        {errors.map((error) => (
          <ErrorAlert key={error.id} error={error} onClose={clearError} />
        ))}
      </div>
      {children}
    </ErrorContext.Provider>
  )
}

// Хук для использования контекста ошибок
export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext)
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  return context
}
