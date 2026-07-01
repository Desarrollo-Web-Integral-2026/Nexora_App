import { forwardRef } from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
        <input
          ref={ref}
          {...props}
          className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 outline-none transition-all duration-200
            focus:ring-2 focus:ring-primary/50
            ${error
              ? 'border-red-500 focus:border-red-500'
              : 'border-white/10 focus:border-primary/50'
            }
            ${props.className ?? ''}
          `}
        />
        {error && (
          <span className="text-red-400 text-xs flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </span>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

export default FormInput