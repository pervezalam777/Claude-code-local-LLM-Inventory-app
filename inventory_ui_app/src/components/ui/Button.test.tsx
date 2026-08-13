import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders the button with children', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click me')
  })

  it('applies default variant styles (primary)', () => {
    const { container } = render(<Button>Primary</Button>)
    const button = container.querySelector('button') as HTMLButtonElement
    expect(button).toHaveClass('bg-blue-600', 'text-white', 'hover:bg-blue-700')
  })

  it('applies secondary variant styles', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>)
    const button = container.querySelector('button') as HTMLButtonElement
    expect(button).toHaveClass('bg-gray-100', 'text-gray-900', 'hover:bg-gray-200')
  })

  it('applies danger variant styles', () => {
    const { container } = render(<Button variant="danger">Danger</Button>)
    const button = container.querySelector('button') as HTMLButtonElement
    expect(button).toHaveClass('bg-red-600', 'text-white', 'hover:bg-red-700')
  })

  it('applies success variant styles', () => {
    const { container } = render(<Button variant="success">Success</Button>)
    const button = container.querySelector('button') as HTMLButtonElement
    expect(button).toHaveClass('bg-green-600', 'text-white', 'hover:bg-green-700')
  })

  it('applies warning variant styles', () => {
    const { container } = render(<Button variant="warning">Warning</Button>)
    const button = container.querySelector('button') as HTMLButtonElement
    expect(button).toHaveClass('bg-yellow-500', 'text-white', 'hover:bg-yellow-600')
  })

  it('applies info variant styles', () => {
    const { container } = render(<Button variant="info">Info</Button>)
    const button = container.querySelector('button') as HTMLButtonElement
    expect(button).toHaveClass('bg-blue-500', 'text-white', 'hover:bg-blue-600')
  })

  it('applies ghost variant styles', () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>)
    const button = container.querySelector('button') as HTMLButtonElement
    expect(button).toHaveClass('hover:bg-gray-100', 'text-gray-700')
  })

  it('applies sm size styles', () => {
    const { container } = render(<Button size="sm">Small</Button>)
    const button = container.querySelector('button') as HTMLButtonElement
    expect(button).toHaveClass('h-9', 'px-3', 'text-xs')
  })

  it('applies md size styles (default)', () => {
    const { container } = render(<Button>Default Size</Button>)
    const button = container.querySelector('button') as HTMLButtonElement
    expect(button).toHaveClass('h-10', 'px-4', 'py-2')
  })

  it('applies lg size styles', () => {
    const { container } = render(<Button size="lg">Large</Button>)
    const button = container.querySelector('button') as HTMLButtonElement
    expect(button).toHaveClass('h-11', 'px-8', 'text-base')
  })

  it('disables button when isLoading is true', async () => {
    const user = userEvent.setup()
    render(<Button isLoading>Loading...</Button>)
    const button = screen.getByRole('button') as HTMLButtonElement
    expect(button).toBeDisabled()

    // Verify no click event fires
    await user.click(button)
    expect(button).not.toHaveFocus() // Focus should not be set on disabled button
  })

  it('disables button when disabled is true', async () => {
    const user = userEvent.setup()
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button') as HTMLButtonElement
    expect(button).toBeDisabled()

    await user.click(button)
    expect(button).not.toHaveFocus()
  })

  it('displays error border when error prop is set', () => {
    const { container } = render(<Button error>With Error</Button>)
    const button = container.querySelector('button') as HTMLButtonElement
    expect(button).toHaveClass('border-red-500')
    // The border style comes from Tailwind CSS utility classes
    // We verify the class is present which means the error styling is applied
  })

  it('shows loading spinner when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>)
    // Check for the spinner SVG element by class
    const svg = screen.getByRole('button').querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg?.querySelector('circle')).toBeInTheDocument()
    expect(svg?.querySelector('path')).toBeInTheDocument()
    // Verify the spinner has the animate-spin class
    expect(svg).toHaveClass('animate-spin')
  })

  it('does not show spinner when isLoading is false or undefined', () => {
    render(<Button>Not Loading</Button>)
    const button = screen.getByRole('button')
    expect(button.querySelector('svg')).not.toBeInTheDocument()
  })

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)

    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('does not call onClick when isLoading', async () => {
    const handleClick = vi.fn()
    render(<Button isLoading onClick={handleClick}>Loading</Button>)

    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('passes additional props to button element', () => {
    render(<Button data-testid="custom-button" aria-label="Custom Button">Custom</Button>)
    const button = screen.getByTestId('custom-button')
    expect(button).toHaveAttribute('aria-label', 'Custom Button')
  })

  it('applies custom className', () => {
    const { container } = render(<Button className="my-custom-class">Custom Class</Button>)
    const button = container.querySelector('button') as HTMLButtonElement
    expect(button).toHaveClass('my-custom-class')
  })

  it('has correct display name for React DevTools', () => {
    expect(Button.displayName).toBe('Button')
  })
})
