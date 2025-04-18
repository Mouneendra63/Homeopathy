import { useState } from 'react';
import { EyeIcon, EyeOffIcon, Lock, User, Loader } from 'lucide-react';
import axios from 'axios';

function AdminSignin() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

interface SigninResponse {
    message?: string;
}

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
        const response = await axios.post<SigninResponse>('http://localhost:3000/adminlogin', {
            userId,
            password,
        });

        const data = response.data;
        if (response.status === 200) {
            console.log('Login successful:', data);
            // Redirect to dashboard or set authentication state
            window.location.href = '/dashboard';
        } else {
            // Handle error response
            setError(data.message || 'Login failed. Please check your credentials.');
        }
    } catch (err: unknown) {
        setError('Network error. Please try again later.');
        console.error('Login error:', err);
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Medical Admin</h2>
          <p className="text-gray-500 mt-2">Administrator Access</p>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border-l-4 border-red-500">
            {error}
          </div>
        )}
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="userId" className="text-sm font-medium text-gray-700 block">User ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2.5 bg-gray-50"
                placeholder="Enter your ID"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 block">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2.5 bg-gray-50"
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {isLoading ? (
              <>
                <Loader className="h-5 w-5 mr-2 animate-spin" /> Processing...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
        
        {/* Contact Developer */}
        <div className="mt-8 text-center">
          <button
            type="button"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Contact Developer
          </button>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">© 2025 Medical Admin System</p>
        </div>
      </div>
    </div>
  );
}

export default AdminSignin ;