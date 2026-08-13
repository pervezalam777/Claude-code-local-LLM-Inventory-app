import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ToastContainer, type ToastMessage } from './Toast'

describe('Toast', () => {
  const baseToasts: ToastMessage[] = [
    {
      id: '1',
      message: 'Test success message',
      variant: 'success',
    },
  ]

  const renderToastContainer = (toasts: ToastMessage[], onRemove?: (id: string) => void) => {
    render(<ToastContainer toasts={toasts} onRemove={onRemove || vi.fn()} />)
  }

  it('does not render when there are no toasts', () => {
    render(<ToastContainer toasts={[]} onRemove={() => {}} />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders toast with success variant', () => {
    renderToastContainer(baseToasts)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Test success message')).toBeInTheDocument()
  })

  it('displays correct icon for success variant', () => {
    const { container } = render(<ToastContainer toasts={baseToasts} onRemove={() => {}} />)
    const svg = container.querySelector('.h-5.w-5')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('stroke', 'currentColor')
  })

  it('renders error variant correctly', () => {
    const errorToasts: ToastMessage[] = [
      {
        id: '2',
        message: 'Error occurred',
        variant: 'error',
      },
    ]
    renderToastContainer(errorToasts)
    expect(screen.getByText('Error occurred')).toBeInTheDocument()
  })

  it('displays correct icon for error variant', () => {
    const errorToasts: ToastMessage[] = [
      {
        id: '2',
        message: 'Error occurred',
        variant: 'error',
      },
    ]
    const { container } = render(<ToastContainer toasts={errorToasts} onRemove={() => {}} />)
    const svg = container.querySelector('.h-5.w-5')
    expect(svg).toBeInTheDocument()
  })

  it('renders warning variant correctly', () => {
    const warningToasts: ToastMessage[] = [
      {
        id: '3',
        message: 'Warning message',
        variant: 'warning',
      },
    ]
    renderToastContainer(warningToasts)
    expect(screen.getByText('Warning message')).toBeInTheDocument()
  })

  it('displays correct icon for warning variant', () => {
    const warningToasts: ToastMessage[] = [
      {
        id: '3',
        message: 'Warning message',
        variant: 'warning',
      },
    ]
    const { container } = render(<ToastContainer toasts={warningToasts} onRemove={() => {}} />)
    const svg = container.querySelector('.h-5.w-5')
    expect(svg).toBeInTheDocument()
  })

  it('renders info variant correctly', () => {
    const infoToasts: ToastMessage[] = [
      {
        id: '4',
        message: 'Info message',
        variant: 'info',
      },
    ]
    renderToastContainer(infoToasts)
    expect(screen.getByText('Info message')).toBeInTheDocument()
  })

  it('displays correct icon for info variant', () => {
    const infoToasts: ToastMessage[] = [
      {
        id: '4',
        message: 'Info message',
        variant: 'info',
      },
    ]
    const { container } = render(<ToastContainer toasts={infoToasts} onRemove={() => {}} />)
    const svg = container.querySelector('.h-5.w-5')
    expect(svg).toBeInTheDocument()
  })

  it('applies correct background color for success variant', () => {
    renderToastContainer(baseToasts)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-green-50')
  })

  it('applies correct text color for success variant', () => {
    renderToastContainer(baseToasts)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('text-green-800')
  })

  it('applies correct border color for error variant', () => {
    const errorToasts: ToastMessage[] = [
      {
        id: '2',
        message: 'Error occurred',
        variant: 'error',
      },
    ]
    renderToastContainer(errorToasts)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('border-red-200')
  })

  it('applies correct background color for warning variant', () => {
    const warningToasts: ToastMessage[] = [
      {
        id: '3',
        message: 'Warning message',
        variant: 'warning',
      },
    ]
    renderToastContainer(warningToasts)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-yellow-50')
  })

  it('applies correct background color for info variant', () => {
    const infoToasts: ToastMessage[] = [
      {
        id: '4',
        message: 'Info message',
        variant: 'info',
      },
    ]
    renderToastContainer(infoToasts)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-blue-50')
  })

  it('calls onRemove when close button is clicked', () => {
    const handleRemove = vi.fn()
    const toasts: ToastMessage[] = [
      {
        id: '5',
        message: 'Removable toast',
        variant: 'success',
      },
    ]
    render(<ToastContainer toasts={toasts} onRemove={handleRemove} />)

    const closeBtn = screen.getByRole('button')
    fireEvent.click(closeBtn)
    expect(handleRemove).toHaveBeenCalledTimes(1)
    expect(handleRemove).toHaveBeenCalledWith('5')
  })

  it('renders multiple toasts in a column', () => {
    const multiToasts: ToastMessage[] = [
      {
        id: '6',
        message: 'First toast',
        variant: 'success',
      },
      {
        id: '7',
        message: 'Second toast',
        variant: 'info',
      },
    ]
    render(<ToastContainer toasts={multiToasts} onRemove={() => {}} />)

    expect(screen.getByText('First toast')).toBeInTheDocument()
    expect(screen.getByText('Second toast')).toBeInTheDocument()
  })

  it('positions toast in bottom-right corner', () => {
    const { container } = render(<ToastContainer toasts={baseToasts} onRemove={() => {}} />)
    const containerDiv = container.querySelector('.fixed.bottom-4.right-4')
    expect(containerDiv).toBeInTheDocument()
  })

  it('has correct transition class for animations', () => {
    renderToastContainer(baseToasts)
    const toastElement = screen.getByRole('alert')
    expect(toastElement).toHaveClass('transition-all')
  })

  it('has shadow class for elevation', () => {
    renderToastContainer(baseToasts)
    const toastElement = screen.getByRole('alert')
    expect(toastElement).toHaveClass('shadow-lg')
  })

  it('renders close button with correct SVG icon', () => {
    renderToastContainer(baseToasts)
    const closeBtn = screen.getByRole('button')
    expect(closeBtn).toBeInTheDocument()
    expect(closeBtn).toHaveClass('rounded-lg', 'p-1.5')

    const svg = closeBtn.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('stroke', 'currentColor')
  })

  it('applies hover class to close button', () => {
    renderToastContainer(baseToasts)
    const closeBtn = screen.getByRole('button')
    expect(closeBtn).toHaveClass('hover:bg-black/5')
  })
})
