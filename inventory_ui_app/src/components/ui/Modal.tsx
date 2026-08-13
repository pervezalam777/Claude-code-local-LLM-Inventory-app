interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

const getWidthClass = (width: ModalProps['width']) => {
  const widths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };
  if (!width) return widths.md;
  return widths[width] || widths.md;
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  width = 'md',
  footer,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4">
      <div
        className={`relative w-full ${getWidthClass(width)} rounded-lg bg-white shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="ml-auto inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-transparent text-sm transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
        {footer && (
          <div className="flex items-center justify-end space-x-2 border-t px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.displayName = 'Modal'
