import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input', () => {
  it('renders the input element with a label', () => {
    render(<Input label="Username" id="username" />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(screen.getByText('Username')).toBeInTheDocument()
  })

  it('applies default styles to input element', () => {
    render(<Input label="Email" id="email" />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input).toHaveClass('border-gray-300')
  })

  it('applies error border when error prop is set', () => {
    render(<Input label="Password" id="password" error="Password is required" />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input).toHaveClass('border-red-500')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('applies focus border styles', () => {
    render(<Input label="Username" id="username" error="Error" />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input).toHaveClass('focus:border-red-500', 'focus:ring-red-500')
  })

  it('applies info focus border when no error is set', () => {
    render(<Input label="Email" id="email" />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input).toHaveClass('focus:border-blue-500', 'focus:ring-blue-500')
  })

  it('renders left icon when provided', () => {
    render(
      <Input label="Search" id="search" leftIcon={<span data-testid="left-icon">🔍</span>} />
    )
    const leftIcon = screen.getByTestId('left-icon')
    expect(leftIcon).toBeInTheDocument()
    // The grandparent div has the positioning classes
    const iconContainer = leftIcon.parentElement?.parentElement
    expect(iconContainer).toHaveClass('absolute', 'inset-y-0', 'left-0', 'flex', 'items-center', 'pl-3')
  })

  it('applies pl-10 class when left icon is present', () => {
    render(
      <Input label="Search" id="search" leftIcon={<span>🔍</span>} />
    )
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input).toHaveClass('pl-10')
  })

  it('renders right icon when provided', () => {
    render(
      <Input label="Password" id="password" rightIcon={<span data-testid="right-icon">👁️</span>} />
    )
    const rightIcon = screen.getByTestId('right-icon')
    expect(rightIcon).toBeInTheDocument()
    // The grandparent div has the positioning classes
    const iconContainer = rightIcon.parentElement?.parentElement
    expect(iconContainer).toHaveClass('absolute', 'inset-y-0', 'right-0', 'flex', 'items-center', 'pr-3')
  })

  it('applies pr-10 class when right icon is present', () => {
    render(
      <Input label="Password" id="password" rightIcon={<span>👁️</span>} />
    )
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input).toHaveClass('pr-10')
  })

  it('renders helper text when provided and no error', () => {
    render(
      <Input
        label="Username"
        id="username"
        helperText="Choose a unique username"
      />
    )
    const helperText = screen.getByText('Choose a unique username')
    expect(helperText).toBeInTheDocument()
    expect(helperText).toHaveClass('text-gray-500', 'text-sm')
  })

  it('does not render helper text when error is present', () => {
    render(
      <Input
        label="Username"
        id="username"
        error="Username is taken"
        helperText="Choose a unique username"
      />
    )
    expect(screen.queryByText('Choose a unique username')).not.toBeInTheDocument()
  })

  it('renders required asterisk when required prop is true', () => {
    render(<Input label="Email" id="email" required />)
    const asterisk = screen.getByText('*')
    expect(asterisk).toBeInTheDocument()
    expect(asterisk).toHaveClass('text-red-500')
  })

  it('passes through additional input props', async () => {
    render(<Input label="Username" id="username" placeholder="Enter username" />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input).toHaveAttribute('placeholder', 'Enter username')
  })

  it('supports controlled input with value and onChange', async () => {
    const handleChange = vi.fn()
    render(
      <Input label="Username" id="username" value="" onChange={handleChange} />
    )
    const input = screen.getByRole('textbox') as HTMLInputElement
    await userEvent.type(input, 'testuser')
    expect(handleChange).toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Input label="Username" id="username" className="my-custom-input" />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input).toHaveClass('my-custom-input')
  })

  it('generates unique id when not provided', () => {
    render(<Input label="Username" />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.id).toMatch(/^input-[a-z0-9]{9}$/)
  })

  it('has correct display name for React DevTools', () => {
    expect(Input.displayName).toBe('Input')
  })
})
