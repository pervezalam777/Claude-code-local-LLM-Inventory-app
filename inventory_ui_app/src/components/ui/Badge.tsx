import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const getBaseStyles = () =>
  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border';

const getVariantStyles = (variant: BadgeVariant) => {
  const variants = {
    success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/50',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/50',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/50',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/50',
  };
  return variants[variant];
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  className = '',
}) => {
  return (
    <span
      className={`
        ${getBaseStyles()}
        ${getVariantStyles(variant)}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
