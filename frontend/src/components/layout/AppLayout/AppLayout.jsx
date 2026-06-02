import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { LogOut, Home, Briefcase, FileText, CheckSquare, Award, Users } from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, children, isActive }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-primary text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{children}</span>
  </Link>
);

const AppLayout = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  const getLinksForRole = (role) => {
    switch (role) {
      case 'admin':
        return [
          { to: '/admin', icon: Home, label: 'Dashboard' },
          { to: '/admin/users', icon: Users, label: 'Manage Users' },
          { to: '/admin/internships', icon: Briefcase, label: 'Internships' },
        ];
      case 'mentor':
        return [
          { to: '/mentor', icon: Home, label: 'Dashboard' },
          { to: '/mentor/internships', icon: Briefcase, label: 'My Internships' },
          { to: '/mentor/applications', icon: FileText, label: 'Applications' },
          { to: '/mentor/tasks', icon: CheckSquare, label: 'Tasks' },
        ];
      case 'intern':
        return [
          { to: '/intern', icon: Home, label: 'Dashboard' },
          { to: '/intern/browse', icon: Briefcase, label: 'Browse Internships' },
          { to: '/intern/applications', icon: FileText, label: 'My Applications' },
          { to: '/intern/tasks', icon: CheckSquare, label: 'My Tasks' },
          { to: '/intern/certificates', icon: Award, label: 'Certificates' },
        ];
      default:
        return [];
    }
  };

  const links = getLinksForRole(user.role);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">Internship Portal</h1>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {links.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              isActive={location.pathname === link.to}
            >
              {link.label}
            </SidebarLink>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <Link to={`/${user.role}/profile`} className="flex items-center gap-3 mb-4 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold overflow-hidden">
              {user.avatar?.url ? <img src={user.avatar.url} alt="avatar" className="w-full h-full object-cover" /> : user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
            </div>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:hidden">
          <h1 className="text-lg font-bold text-primary">Internship Portal</h1>
          <button onClick={logout} className="text-gray-500 hover:text-red-600">
            <LogOut size={20} />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
