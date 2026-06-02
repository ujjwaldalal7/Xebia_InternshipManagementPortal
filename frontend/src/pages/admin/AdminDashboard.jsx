import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/common/Card/Card';
import { Users, Briefcase, FileText, CheckSquare, Award } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <Card hover>
    <CardBody className="flex items-center p-6">
      <div className={`p-4 rounded-full ${colorClass} mr-4`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </CardBody>
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setStats(res.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
  if (!stats) return <div className="p-8 text-center text-red-500">Failed to load statistics.</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.users.total} icon={Users} colorClass="bg-blue-500" />
        <StatCard title="Internships" value={stats.internships.total} icon={Briefcase} colorClass="bg-indigo-500" />
        <StatCard title="Applications" value={stats.applications.total} icon={FileText} colorClass="bg-green-500" />
        <StatCard title="Certificates" value={stats.certificates.total} icon={Award} colorClass="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardBody>
            {stats.recentApplications.length === 0 ? (
              <p className="text-gray-500">No applications yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {stats.recentApplications.map((app) => (
                  <li key={app._id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{app.intern?.name}</p>
                      <p className="text-sm text-gray-500">{app.internship?.title}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {app.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Internships</CardTitle>
          </CardHeader>
          <CardBody>
            {stats.recentInternships.length === 0 ? (
              <p className="text-gray-500">No internships yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {stats.recentInternships.map((internship) => (
                  <li key={internship._id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{internship.title}</p>
                      <p className="text-sm text-gray-500">{internship.company}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      internship.status === 'open' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {internship.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
