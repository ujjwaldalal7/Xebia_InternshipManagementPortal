import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout/AppLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Unauthorized from './pages/auth/Unauthorized';
import PendingApproval from './pages/auth/PendingApproval';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import AdminInternships from './pages/admin/AdminInternships';

// Mentor Pages
import MentorDashboard from './pages/mentor/MentorDashboard';
import MentorInternships from './pages/mentor/MentorInternships';
import ApplicationManagement from './pages/mentor/ApplicationManagement';
import TaskManagement from './pages/mentor/TaskManagement';

// Intern Pages
import BrowseInternships from './pages/intern/BrowseInternships';
import MyCertificates from './pages/intern/MyCertificates';

// Common Pages
import Profile from './pages/common/Profile';

const InternDashboard = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
          <p className="text-xl text-blue-100 font-medium leading-relaxed">
            Ready to kickstart your career? Discover the latest internships, apply to your dream roles, and track your tasks all in one place.
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/intern/browse" className="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-50 transition-colors transform hover:-translate-y-1">
              Explore Internships
            </Link>
            <Link to="/intern/applications" className="bg-indigo-500 bg-opacity-30 border border-indigo-400 text-white px-6 py-3 rounded-full font-bold hover:bg-opacity-40 transition-colors transform hover:-translate-y-1">
              My Applications
            </Link>
          </div>
        </div>
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay pointer-events-none"></div>
        <div className="absolute bottom-0 right-40 -mb-20 w-60 h-60 bg-purple-400 opacity-20 rounded-full blur-2xl mix-blend-overlay pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Internships</h3>
          <p className="text-gray-500 mt-1">Browse and apply to exclusive roles matching your skills.</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Tasks</h3>
          <p className="text-gray-500 mt-1">Complete assigned milestones to progress through your journey.</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Certificates</h3>
          <p className="text-gray-500 mt-1">Earn and download verified certificates for your portfolio.</p>
        </div>
      </div>
    </div>
  );
};

const PlaceholderPage = ({ title }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-64 flex items-center justify-center">
    <h2 className="text-2xl font-bold text-gray-400">{title} (Coming Soon)</h2>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/pending" element={<PendingApproval />} />

          {/* Protected Routes - Admin */}
          <Route path="/admin" element={<AppLayout allowedRoles={['admin']} />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="internships" element={<AdminInternships />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Protected Routes - Mentor */}
          <Route path="/mentor" element={<AppLayout allowedRoles={['mentor', 'admin']} />}>
            <Route index element={<MentorDashboard />} />
            <Route path="internships" element={<MentorInternships />} />
            <Route path="applications" element={<ApplicationManagement />} />
            <Route path="tasks" element={<TaskManagement />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Protected Routes - Intern */}
          <Route path="/intern" element={<AppLayout allowedRoles={['intern']} />}>
            <Route index element={<InternDashboard />} />
            <Route path="browse" element={<BrowseInternships />} />
            <Route path="applications" element={<ApplicationManagement />} />
            <Route path="tasks" element={<TaskManagement />} />
            <Route path="certificates" element={<MyCertificates />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
