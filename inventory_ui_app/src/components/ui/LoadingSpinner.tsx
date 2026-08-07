interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const getSizeClass = (size: LoadingSpinnerProps['size']) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };
  if (!size) return sizes.md;
  return sizes[size] || sizes.md;
};

export const LoadingSpinner = ({
  size = 'md',
  text,
  className = '',
}: LoadingSpinnerProps) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${getSizeClass(size)} border-t-gray-300 animate-spin rounded-full border-t-blue-600`}
      />
      {text && (
        <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );
};
