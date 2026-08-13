import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from './Modal'

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={() => {}}>Content</Modal>)
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('renders when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={() => {}}>Content</Modal>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('calls onClose when closing button is clicked', () => {
    const handleClose = vi.fn()
    render(<Modal isOpen={true} onClose={handleClose} title="Title">Content</Modal>)

    const closeBtn = screen.getByRole('button')
    fireEvent.click(closeBtn)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('renders title when provided', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="Test Title">Content</Modal>)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('does not render title when not provided', () => {
    render(<Modal isOpen={true} onClose={() => {}}>Content</Modal>)
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
  })

  it('renders close button with correct SVG icon when title is provided', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="Title">Content</Modal>)

    const closeBtn = screen.getByRole('button')
    expect(closeBtn).toHaveClass('h-8', 'w-8')

    const svg = closeBtn.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('fill', 'none')
    expect(svg).toHaveAttribute('stroke', 'currentColor')
  })

  it('applies default width (md) when no width prop is provided', () => {
    render(<Modal isOpen={true} onClose={() => {}}>Content</Modal>)

    const modal = document.querySelector('.max-w-md')
    expect(modal).toBeInTheDocument()
  })

  it('applies small width (sm) when width prop is sm', () => {
    render(<Modal isOpen={true} onClose={() => {}} width="sm">Content</Modal>)

    const modal = document.querySelector('.max-w-sm')
    expect(modal).toBeInTheDocument()
  })

  it('applies large width (lg) when width prop is lg', () => {
    render(<Modal isOpen={true} onClose={() => {}} width="lg">Content</Modal>)

    const modal = document.querySelector('.max-w-lg')
    expect(modal).toBeInTheDocument()
  })

  it('applies extra large width (xl) when width prop is xl', () => {
    render(<Modal isOpen={true} onClose={() => {}} width="xl">Content</Modal>)

    const modal = document.querySelector('.max-w-xl')
    expect(modal).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <p>Child content</p>
        <button data-testid="child-btn">Click</button>
      </Modal>
    )

    expect(screen.getByText('Child content')).toBeInTheDocument()
    expect(screen.getByTestId('child-btn')).toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    const footer = <button>Footer Button</button>
    render(<Modal isOpen={true} onClose={() => {}} footer={footer}>Content</Modal>)

    expect(screen.getByText('Footer Button')).toBeInTheDocument()

    const modalContainer = document.querySelector('[class*="flex items-center justify-end"]')
    expect(modalContainer).toBeInTheDocument()
  })

  it('stops event propagation when clicking on modal content', () => {
    const handleBackgroundClick = vi.fn()
    render(
      <div onClick={handleBackgroundClick}>
        <Modal isOpen={true} onClose={() => {}}>Content</Modal>
      </div>
    )

    const modalDiv = document.querySelector('[class*="w-full"]')
    if (modalDiv) {
      fireEvent.click(modalDiv)
      // Background click handler should not be called
      expect(handleBackgroundClick).not.toHaveBeenCalled()
    }
  })

  it('has correct display name for React DevTools', () => {
    expect(Modal.displayName).toBe('Modal')
  })
})
