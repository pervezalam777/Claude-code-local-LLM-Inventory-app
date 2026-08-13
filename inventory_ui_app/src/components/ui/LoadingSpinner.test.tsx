import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from './LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders the spinner element', () => {
    render(<LoadingSpinner />)
    const container = document.querySelector('div.flex.flex-col.items-center.justify-center')
    expect(container).toBeInTheDocument()
  })

  it('applies default size (md) styles when no size is provided', () => {
    render(<LoadingSpinner />)
    const spinnerDiv = document.querySelector('div.flex.flex-col.items-center.justify-center > div')
    expect(spinnerDiv).toHaveClass('h-8', 'w-8', 'border-3')
  })

  it('applies small (sm) size styles when size is sm', () => {
    render(<LoadingSpinner size="sm" />)
    const spinnerDiv = document.querySelector('div.flex.flex-col.items-center.justify-center > div')
    expect(spinnerDiv).toHaveClass('h-4', 'w-4', 'border-2')
  })

  it('applies medium (md) size styles when size is md', () => {
    render(<LoadingSpinner size="md" />)
    const spinnerDiv = document.querySelector('div.flex.flex-col.items-center.justify-center > div')
    expect(spinnerDiv).toHaveClass('h-8', 'w-8', 'border-3')
  })

  it('applies large (lg) size styles when size is lg', () => {
    render(<LoadingSpinner size="lg" />)
    const spinnerDiv = document.querySelector('div.flex.flex-col.items-center.justify-center > div')
    expect(spinnerDiv).toHaveClass('h-12', 'w-12', 'border-4')
  })

  it('renders text when text prop is provided', () => {
    render(<LoadingSpinner text="Loading..." />)
    const textElement = screen.getByText('Loading...')
    expect(textElement).toBeInTheDocument()
    expect(textElement).toHaveClass('mt-2', 'text-sm', 'font-medium', 'text-gray-500')
  })

  it('renders with custom className', () => {
    render(<LoadingSpinner className="my-custom-spinner" />)
    const container = document.querySelector('div.flex.flex-col.items-center.justify-center.my-custom-spinner')
    expect(container).toBeInTheDocument()
  })

  it('applies border-t-gray-300 class for default border color', () => {
    render(<LoadingSpinner />)
    const spinnerDiv = document.querySelector('div.flex.flex-col.items-center.justify-center > div')
    expect(spinnerDiv).toHaveClass('border-t-gray-300')
  })

  it('applies border-t-blue-600 class for spinning color', () => {
    render(<LoadingSpinner />)
    const spinnerDiv = document.querySelector('div.flex.flex-col.items-center.justify-center > div')
    expect(spinnerDiv).toHaveClass('border-t-blue-600')
  })

  it('applies animate-spin and rounded-full classes', () => {
    render(<LoadingSpinner />)
    const spinnerDiv = document.querySelector('div.flex.flex-col.items-center.justify-center > div')
    expect(spinnerDiv).toHaveClass('animate-spin', 'rounded-full')
  })

  it('does not render text when text prop is undefined', () => {
    render(<LoadingSpinner />)
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })

  it('does not render error text element when text prop is empty string', () => {
    render(<LoadingSpinner text="" />)
    const textElement = document.querySelector('.mt-2')
    expect(textElement).toBeNull()
  })

  it('has correct display name for React DevTools', () => {
    expect(LoadingSpinner.displayName).toBe('LoadingSpinner')
  })
})
