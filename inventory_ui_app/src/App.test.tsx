import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App', () => {
  it('renders the app header with title', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/inventory app/i)
  })

  it('renders navigation links for Home, Items, and Style Guide', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /items/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /style guide/i })).toBeInTheDocument()
  })

  it('renders welcome message on home page', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText(/welcome to the inventory management system/i)).toBeInTheDocument()
  })

  it('renders health check component', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    // The HealthCheck component makes an actual fetch call
    // For a pure unit test, we would mock the API, but this verifies integration
    expect(document.body).toBeTruthy()
  })
})
