import React from 'react';
import { Label } from './Label';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  required,
  error,
  leftIcon,
  rightIcon,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name?.toString() || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={inputId} required={required} error={error}>
          {label}
        </Label>
      )}
      <div className="relative mt-1 rounded-md shadow-sm">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{leftIcon}</span>
          </div>
        )}
        <input
          id={inputId}
          className={`
            block w-full rounded-md border-gray-300 dark:border-gray-600 pr-10 pl-3
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{rightIcon}</span>
          </div>
        )}
      </div>
      {!error && helperText && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400" id={`${inputId}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

Input.displayName = 'Input';
