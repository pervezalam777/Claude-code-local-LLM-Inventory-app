import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders the badge with children', () => {
    render(<Badge>Test Badge</Badge>)
    const badge = screen.getByText('Test Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Test Badge')
  })

  it('applies success variant styles', () => {
    const { container } = render(<Badge variant="success">Success</Badge>)
    const badge = container.querySelector('span') as HTMLElement
    expect(badge).toHaveClass(
      'bg-green-100',
      'text-green-800',
      'border-green-200'
    )
  })

  it('applies warning variant styles', () => {
    const { container } = render(<Badge variant="warning">Warning</Badge>)
    const badge = container.querySelector('span') as HTMLElement
    expect(badge).toHaveClass(
      'bg-yellow-100',
      'text-yellow-800',
      'border-yellow-200'
    )
  })

  it('applies danger variant styles', () => {
    const { container } = render(<Badge variant="danger">Danger</Badge>)
    const badge = container.querySelector('span') as HTMLElement
    expect(badge).toHaveClass(
      'bg-red-100',
      'text-red-800',
      'border-red-200'
    )
  })

  it('applies info variant styles (default)', () => {
    const { container } = render(<Badge>Info</Badge>)
    const badge = container.querySelector('span') as HTMLElement
    expect(badge).toHaveClass(
      'bg-blue-100',
      'text-blue-800',
      'border-blue-200'
    )
  })

  it('applies base styles (inline-flex, items-center, px, py, rounded-full)', () => {
    const { container } = render(<Badge>Base</Badge>)
    const badge = container.querySelector('span') as HTMLElement
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'px-2.5',
      'py-0.5',
      'rounded-full'
    )
  })

  it('applies text-xs and font-medium styles', () => {
    const { container } = render(<Badge>Text</Badge>)
    const badge = container.querySelector('span') as HTMLElement
    expect(badge).toHaveClass('text-xs', 'font-medium')
  })

  it('applies border class', () => {
    const { container } = render(<Badge>Border Test</Badge>)
    const badge = container.querySelector('span') as HTMLElement
    expect(badge).toHaveClass('border')
  })

  it('passes custom className to badge element', () => {
    const { container } = render(<Badge className="custom-class">Custom Class</Badge>)
    const badge = container.querySelector('span') as HTMLElement
    expect(badge).toHaveClass('custom-class')
  })

  it('has correct display name for React DevTools', () => {
    expect(Badge.displayName).toBe('Badge')
  })
})
