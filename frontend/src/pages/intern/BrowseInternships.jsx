/**
 * @file BrowseInternships.jsx
 * @description Intern dashboard component for viewing and applying to open internships.
 * Fetches the user's active applications and strictly filters out internships they have already applied to.
 */
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/common/Card/Card';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button/Button';
import { Briefcase, Send } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * BrowseInternships Component
 */

const BrowseInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [internshipsRes, appsRes] = await Promise.all([
          api.get('/internships'),
          api.get('/applications')
        ]);
        
        // Get IDs of internships the user has already applied to
        const appliedIds = appsRes.data.data.applications.map(app => app.internship._id || app.internship);
        
        // Filter out closed internships and already applied ones
        const available = internshipsRes.data.data.internships.filter(
          internship => !appliedIds.includes(internship._id) && !internship.isFull
        );
        
        setInternships(available);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /**
   * handleApply
   * Submits an application payload to the backend.
   * 
   * @param {string} internshipId - ID of the internship to apply to
   */
  const handleApply = async (internshipId) => {
    try {
      await api.post('/applications', { internshipId, coverLetter: 'I am highly interested in this role.' });
      toast.success('Application submitted successfully!');
      fetchData(); // Refresh to remove applied internship
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply.');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading internships...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Browse Internships</h2>
          <p className="text-gray-600 mt-1">Find and apply for open internship positions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map((internship) => (
          <Card key={internship._id} hover className="flex flex-col">
            <CardBody className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 rounded-lg text-primary">
                  <Briefcase size={24} />
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  internship.isFull ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {internship.isFull ? 'Full' : 'Open'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{internship.title}</h3>
              <p className="text-sm font-medium text-gray-600 mb-3">{internship.company}</p>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">Domain:</span> {internship.domain}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">Location:</span> {internship.location}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">Duration:</span> {internship.duration.value} {internship.duration.unit}
                </p>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">{internship.description}</p>
            </CardBody>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">
                Stipend: ₹{internship.stipend.amount}
              </span>
              <Button 
                size="sm" 
                onClick={() => handleApply(internship._id)}
                disabled={internship.isFull}
                className="gap-2"
              >
                <Send size={16} /> Apply
              </Button>
            </div>
          </Card>
        ))}
        {internships.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No open internships available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseInternships;
