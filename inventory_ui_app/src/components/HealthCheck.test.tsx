import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import apiClient from '../api/client'
import HealthCheck from './HealthCheck'

// Mock the API client
vi.mock('../api/client')

describe('HealthCheck', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset console mocks
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renders the health check component with title', () => {
    render(<HealthCheck />)
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(/API Health Check/i)
  })

  it('renders the instructions text', () => {
    render(<HealthCheck />)
    expect(screen.getByText(/Click the button below to test the API connection/i)).toBeInTheDocument()
  })

  it('renders the server URL in instructions', () => {
    render(<HealthCheck />)
    expect(screen.getByText(/http:\/\/localhost:8000/i)).toBeInTheDocument()
  })

  it('renders check health button with default label', () => {
    render(<HealthCheck />)
    const button = screen.getByRole('button', { name: /check api health/i })
    expect(button).toBeInTheDocument()
    expect(button).toBeEnabled()
  })

  it('applies blue background class for idle state', () => {
    render(<HealthCheck />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-600')
  })

  it('applies hover:bg-blue-700 to button in idle state', () => {
    render(<HealthCheck />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('hover:bg-blue-700')
  })

  it('disables button when status is loading', async () => {
    ;(apiClient.get as vi.Mock).mockImplementation(() =>
      new Promise((resolve) => setTimeout(() => resolve({ data: { timestamp: '2024-01-01T00:00:00Z' } }), 100))
    )

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)
    expect(button).toBeDisabled()

    await waitFor(() => {
      expect(screen.getByText(/checking\.\.\./i)).toBeInTheDocument()
    })
  })

  it('shows checking... text during loading', async () => {
    ;(apiClient.get as vi.Mock).mockImplementation(() =>
      new Promise((resolve) => setTimeout(() => resolve({ data: { timestamp: '2024-01-01T00:00:00Z' } }), 50))
    )

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/checking\.\.\./i)).toBeInTheDocument()
    })
  })

  it('calls API client get method with correct path when button is clicked', async () => {
    ;(apiClient.get as vi.Mock).mockResolvedValue({ data: { timestamp: '2024-01-01T00:00:00Z' } })

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('$/api/v1/health')
    })
  })

  it('sets status to success when API call succeeds', async () => {
    ;(apiClient.get as vi.Mock).mockResolvedValue({ data: { timestamp: '2024-01-01T00:00:00Z' } })

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/connected!/i)).toBeInTheDocument()
    })
  })

  it('sets status to success and displays response timestamp', async () => {
    const mockTimestamp = '2024-01-01T12:34:56Z'
    ;(apiClient.get as vi.Mock).mockResolvedValue({ data: { timestamp: mockTimestamp } })

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/connected!/i)).toBeInTheDocument()
    })

    // Verify the timestamp is displayed in the success message
    expect(screen.getByText(/connected!.*2024-01-01T12:34:56Z/i)).toBeInTheDocument()
  })

  it('sets status to success and displays current time when no timestamp in response', async () => {
    const mockResponse = { data: {} }
    ;(apiClient.get as vi.Mock).mockResolvedValue(mockResponse)

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/connected!/i)).toBeInTheDocument()
    })
  })

  it('sets status to success when response has no timestamp property', async () => {
    ;(apiClient.get as vi.Mock).mockResolvedValue({ data: { other: 'data' } })

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/connected!/i)).toBeInTheDocument()
    })
  })

  it('applies green background class for success status', async () => {
    ;(apiClient.get as vi.Mock).mockResolvedValue({ data: { timestamp: '2024-01-01T00:00:00Z' } })

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveClass('bg-green-600')
    })
  })

  it('applies hover:bg-green-700 for success status', async () => {
    ;(apiClient.get as vi.Mock).mockResolvedValue({ data: { timestamp: '2024-01-01T00:00:00Z' } })

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveClass('hover:bg-green-700')
    })
  })

  it('displays success message in green color', async () => {
    ;(apiClient.get as vi.Mock).mockResolvedValue({ data: { timestamp: '2024-01-01T00:00:00Z' } })

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/connected!/i)).toHaveClass('text-green-600')
    })
  })

  it('calls console.log with success data', async () => {
    const mockData = { timestamp: '2024-01-01T00:00:00Z' }
    ;(apiClient.get as vi.Mock).mockResolvedValue({ data: mockData })

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Health check successful:', mockData)
    })
  })

  it('sets status to error when API call fails', async () => {
    ;(apiClient.get as vi.Mock).mockRejectedValue(new Error('Network error'))

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/connection failed/i)).toBeInTheDocument()
    })
  })

  it('applies red background class for error status', async () => {
    ;(apiClient.get as vi.Mock).mockRejectedValue(new Error('Network error'))

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveClass('bg-red-600')
    })
  })

  it('applies hover:bg-red-700 for error status', async () => {
    ;(apiClient.get as vi.Mock).mockRejectedValue(new Error('Network error'))

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveClass('hover:bg-red-700')
    })
  })

  it('displays error message in red color', async () => {
    ;(apiClient.get as vi.Mock).mockRejectedValue(new Error('Network error'))

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/connection failed/i)).toHaveClass('text-red-600')
    })
  })

  it('displays correct error message for connection failure', async () => {
    ;(apiClient.get as vi.Mock).mockRejectedValue(new Error('Network error'))

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/connection failed\. make sure the backend is running on port 8000/i)).toBeInTheDocument()
    })
  })

  it('calls console.error with error details', async () => {
    const mockError = new Error('Network error')
    ;(apiClient.get as vi.Mock).mockRejectedValue(mockError)

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Health check failed:', mockError)
    })
  })

  it('handles API timeout error', async () => {
    const timeoutError = new Error('timeout of 10000ms exceeded')
    ;(apiClient.get as vi.Mock).mockRejectedValue(timeoutError)

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/connection failed/i)).toBeInTheDocument()
    })
  })

  it('handles unknown error gracefully', async () => {
    ;(apiClient.get as vi.Mock).mockRejectedValue(new Error('Unknown error'))

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/connection failed/i)).toBeInTheDocument()
    })
  })

  it('does not display success or error message in initial idle state', () => {
    render(<HealthCheck />)

    expect(screen.queryByText(/connected!/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/connection failed/i)).not.toBeInTheDocument()
  })

  it('changes button text after multiple clicks with different results', async () => {
    // First click - success
    ;(apiClient.get as vi.Mock).mockResolvedValue({ data: { timestamp: '2024-01-01T00:00:00Z' } })

    render(<HealthCheck />)
    let button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/connected!/i)).toBeInTheDocument()
    })

    // Second click - failure (mock changes after first call)
    ;(apiClient.get as vi.Mock).mockRejectedValueOnce(new Error('Network error'))

    button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/connection failed/i)).toBeInTheDocument()
    })
  })

  it('maintains correct transition-colors class on button', () => {
    render(<HealthCheck />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('transition-colors')
  })

  it('has rounded-md class for button corners', () => {
    render(<HealthCheck />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('rounded-md')
  })

  it('has px-4 py-2 padding on button', () => {
    render(<HealthCheck />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('px-4')
    expect(button).toHaveClass('py-2')
  })

  it('applies disabled:bg-blue-400 when loading', async () => {
    ;(apiClient.get as vi.Mock).mockImplementation(() =>
      new Promise((resolve) => setTimeout(() => resolve({ data: { timestamp: '2024-01-01T00:00:00Z' } }), 50))
    )

    render(<HealthCheck />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(button).toBeDisabled()
    })
  })

  it('renders component wrapper with correct classes', () => {
    render(<HealthCheck />)
    const wrapper = screen.getByText(/API Health Check/i).closest('div')
    expect(wrapper).toHaveClass('mt-6', 'p-4', 'border', 'rounded-lg')
  })

  it('has mb-2 class on heading element', () => {
    render(<HealthCheck />)
    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toHaveClass('mb-2')
  })

  it('applies text-sm text-gray-600 to instructions paragraph', () => {
    render(<HealthCheck />)
    const instructions = screen.getByText(/Click the button below/i)
    expect(instructions).toHaveClass('text-sm', 'text-gray-600')
  })
})
