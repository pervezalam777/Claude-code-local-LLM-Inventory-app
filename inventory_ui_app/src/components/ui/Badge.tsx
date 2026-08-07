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
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
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
