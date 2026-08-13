import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Label } from './Label'

describe('Label', () => {
  it('renders label with children', () => {
    render(<Label>Username</Label>)
    const label = screen.getByText('Username')
    expect(label).toBeInTheDocument()
    expect(label).toHaveTextContent('Username')
  })

  it('applies base styles (block, text-sm, font-medium, text-gray-700)', () => {
    const { container } = render(<Label>Test Label</Label>)
    const label = container.querySelector('label') as HTMLElement
    expect(label).toHaveClass('block', 'text-sm', 'font-medium', 'text-gray-700')
  })

  it('applies required red asterisk', () => {
    render(<Label required>Username</Label>)
    const asterisk = screen.getByText('*')
    expect(asterisk).toBeInTheDocument()
    expect(asterisk).toHaveClass('ml-1', 'text-red-500')
    expect(asterisk).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies error text with red color when error prop is set', () => {
    render(<Label error="This field is required">Username</Label>)
    const errorText = screen.getByText('This field is required')
    expect(errorText).toBeInTheDocument()
    expect(errorText).toHaveClass('mt-1', 'text-sm', 'text-red-600')
  })

  it('renders htmlFor attribute correctly', () => {
    const { container } = render(<Label htmlFor="username">Username</Label>)
    const label = container.querySelector('label') as HTMLElement
    expect(label).toHaveAttribute('for', 'username')
  })

  it('passes custom className to label element', () => {
    const { container } = render(<Label className="custom-label">Test</Label>)
    const label = container.querySelector('label') as HTMLElement
    expect(label).toHaveClass('custom-label')
  })

  it('renders both error and asterisk when required and error are set', () => {
    render(<Label required error="Required">Username</Label>)
    const asterisk = screen.getByText('*')
    const errorText = screen.getByText('Required')
    expect(asterisk).toBeInTheDocument()
    expect(errorText).toBeInTheDocument()
  })

  it('does not show asterisk when required is false', () => {
    render(<Label required={false}>Username</Label>)
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('does not show error text when error prop is empty string', () => {
    const { container } = render(<Label error="">Username</Label>)
    const errorText = container.querySelector('.text-red-600')
    expect(errorText).toBeNull()
  })

  it('renders nested elements within label', () => {
    render(
      <Label>
        Click <a href="#" className="text-blue-600 hover:underline">here</a> for help
      </Label>
    )
    const link = screen.getByRole('link', { name: /here/i })
    expect(link).toBeInTheDocument()
  })

  it('has correct display name for React DevTools', () => {
    expect(Label.displayName).toBe('Label')
  })
})
