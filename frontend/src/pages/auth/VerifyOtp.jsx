import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';
import Button from '../../components/common/Button/Button';
import { Card, CardBody } from '../../components/common/Card/Card';
import { useAuth } from '../../context/AuthContext';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtpHandler } = useAuth(); // Need to add to AuthContext

  const email = location.state?.email;

  if (!email) {
    navigate('/register');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await verifyOtpHandler(email, otp);
      navigate('/intern'); // Assuming new registers are interns
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setMessage('');
      setError('');
      const res = await api.post('/auth/resend-otp', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent an OTP to <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>
        
        <Card>
          <CardBody>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              {message && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                  <p className="text-sm text-green-700">{message}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">6-Digit OTP</label>
                <div className="mt-1">
                  <input
                    type="text"
                    required
                    maxLength="6"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-center tracking-widest text-lg"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Verify Account
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center">
              <button onClick={handleResend} className="text-sm font-medium text-primary hover:text-primary-hover">
                Didn't receive the code? Resend
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOtp;
