import { useState } from 'react';
import apiClient from '../api/client';

function HealthCheck() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseDate, setResponseDate] = useState<string | null>(null);

  const checkHealth = async () => {
    setStatus('loading');
    try {
      const response = await apiClient.get('/health');
      setStatus('success');
      setResponseDate(response.data?.timestamp || new Date().toISOString());
      console.log('Health check successful:', response.data);
    } catch (error) {
      setStatus('error');
      console.error('Health check failed:', error);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">API Health Check</h3>
      <p className="text-sm text-gray-600 mb-4">
        Click the button below to test the API connection. The backend should be running at
        <code className="mx-1 bg-gray-100 px-1 rounded">http://localhost:8000</code>
      </p>
      <button
        onClick={checkHealth}
        disabled={status === 'loading'}
        className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
          status === 'error'
            ? 'bg-red-600 hover:bg-red-700'
            : status === 'success'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'
        }`}
      >
        {status === 'loading' ? 'Checking...' : 'Check API Health'}
      </button>
      {status === 'success' && (
        <p className="mt-2 text-green-600">Connected! Server time: {responseDate}</p>
      )}
      {status === 'error' && (
        <p className="mt-2 text-red-600">
          Connection failed. Make sure the backend is running on port 8000.
        </p>
      )}
    </div>
  );
}

export default HealthCheck;
