import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  error?: string;
}

export const Label: React.FC<LabelProps> = ({
  children,
  required,
  error,
  className = '',
  htmlFor,
  ...props
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className}`}
      {...props}
    >
      <span className="flex items-center">
        {children}
        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </span>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </label>
  );
};

Label.displayName = 'Label';
