/**
 * @file PendingApproval.jsx
 * @description Component displayed to users who have registered but have not yet been approved by an administrator.
 * It serves as a waiting room restricting access to the main application dashboards.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Clock } from 'lucide-react';
import Button from '../../components/common/Button/Button';

/**
 * PendingApproval Component
 * 
 * Renders a full-page waiting screen. Displays the user's name from AuthContext
 * and provides a functional logout button to clear the current session.
 */

const PendingApproval = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * handleLogout
   * Clears the user's authentication token and state, then redirects them back to the login page.
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
          <Clock className="text-yellow-500" size={40} />
        </div>
        
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Account Pending</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Hello <span className="font-semibold text-gray-900">{user?.name}</span>! Your registration is successful, but your account is currently awaiting approval.
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md text-left mb-8">
          <p className="text-sm text-blue-700">
            An administrator must review your account and assign you a role (Intern or Mentor) before you can access the dashboard. Please check back later!
          </p>
        </div>

        <Button onClick={handleLogout} variant="outline" className="w-full flex justify-center items-center gap-2">
          <LogOut size={18} /> Logout for now
        </Button>
      </div>
    </div>
  );
};

export default PendingApproval;
