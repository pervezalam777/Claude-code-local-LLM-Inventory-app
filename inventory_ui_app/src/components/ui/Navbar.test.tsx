import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Navbar } from './Navbar'

describe('Navbar', () => {
  it('renders default title when no title is provided', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByText('Inventory')).toBeInTheDocument()
  })

  it('renders custom title when provided', () => {
    render(
      <MemoryRouter>
        <Navbar title="My App" />
      </MemoryRouter>
    )
    expect(screen.getByText('My App')).toBeInTheDocument()
  })

  it('does not render links when no links are provided', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument()
  })

  it('renders links when provided', () => {
    const links = [
      { label: 'Home', to: '/' },
      { label: 'About', to: '/about' },
    ]
    render(
      <MemoryRouter>
        <Navbar links={links} />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
  })

  it('applies correct href to links', () => {
    const links = [{ label: 'Products', to: '/products' }]
    render(
      <MemoryRouter>
        <Navbar links={links} />
      </MemoryRouter>
    )

    const link = screen.getByRole('link', { name: 'Products' })
    expect(link).toHaveAttribute('href', '/products')
  })

  it('applies correct navbar container class', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    const nav = document.querySelector('nav')
    expect(nav).toHaveClass('border-gray-200', 'bg-white', 'px-4', 'py-2.5', 'dark:bg-gray-800', 'sm:px-4')
  })

  it('applies correct link styles', () => {
    const links = [{ label: 'Settings', to: '/settings' }]
    render(
      <MemoryRouter>
        <Navbar links={links} />
      </MemoryRouter>
    )

    const link = screen.getByRole('link', { name: 'Settings' })
    expect(link).toHaveClass(
      'text-gray-500',
      'hover:bg-gray-100',
      'dark:text-gray-400',
      'dark:hover:bg-gray-700',
      'block',
      'rounded',
      'p-2',
      'text-sm',
      'font-medium',
      'transition-colors'
    )
  })

  it('applies correct title text styles', () => {
    render(
      <MemoryRouter>
        <Navbar title="Test Title" />
      </MemoryRouter>
    )

    const title = screen.getByText('Test Title')
    expect(title).toHaveClass(
      'text-xl',
      'font-semibold',
      'text-gray-900',
      'dark:text-white'
    )
  })

  it('has flex container with correct classes', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    const flexContainer = document.querySelector('.flex.flex-wrap.items-center.justify-between')
    expect(flexContainer).toBeInTheDocument()
  })

  it('renders logo link with to="/" when no title links are provided', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    const logoLink = screen.getByRole('link')
    expect(logoLink).toHaveAttribute('href', '/')
  })
})
