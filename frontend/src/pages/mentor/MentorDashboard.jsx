import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/common/Card/Card';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, FileText, CheckSquare } from 'lucide-react';

const MentorDashboard = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/internships');
        setInternships(res.data.data.internships);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h2>
        <p className="text-gray-600 mt-1">Here is the overview of your mentor activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex items-center p-6">
            <div className="p-4 rounded-full bg-indigo-500 mr-4">
              <Briefcase size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">My Internships</p>
              <p className="text-2xl font-bold text-gray-900">{internships.length}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Internships</CardTitle>
        </CardHeader>
        <CardBody>
          {internships.length === 0 ? (
            <p className="text-gray-500">You haven't posted any internships yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {internships.map((internship) => (
                <div key={internship._id} className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors">
                  <h4 className="font-semibold text-lg text-gray-900">{internship.title}</h4>
                  <p className="text-sm text-gray-600">{internship.company}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      internship.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {internship.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Seats: {internship.filledSeats} / {internship.totalSeats}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default MentorDashboard;
