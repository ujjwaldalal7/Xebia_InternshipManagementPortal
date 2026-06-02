/**
 * @file ApplicationManagement.jsx
 * @description Mentor dashboard component for reviewing intern applications.
 * Handles fetching applications, updating their status (accept/reject), generating certificates, 
 * and viewing candidate profiles (including avatar, bio, and resume rendering).
 */
import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import { useAuth } from '../../context/AuthContext';

/**
 * ApplicationManagement Component
 */

const ApplicationManagement = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications');
      setApplications(res.data.data.applications);
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  /**
   * handleUpdateStatus
   * Updates an application's status to accepted or rejected via API.
   * Reloads applications list on success.
   * 
   * @param {string} id - The MongoDB ID of the application
   * @param {string} status - New status string ('accepted' | 'rejected')
   */
  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}/status`, { status });
      fetchApplications();
    } catch (error) {
      toast.success();
    }
  };

  /**
   * handleGenerateCertificate
   * Issues a new completion certificate for an accepted intern.
   * 
   * @param {Object} app - The full application object
   */
  const handleGenerateCertificate = async (app) => {
    if (!window.confirm('Generate a completion certificate for this intern?')) return;
    try {
      await api.post('/certificates', {
        internId: app.intern._id,
        internshipId: app.internship._id,
        issueDate: new Date().toISOString(),
      });
      toast.success();
    } catch (error) {
      toast.success();
    }
  };

  /**
   * handleViewResume
   * Gracefully opens Cloudinary raw files in a new tab by forcing 'application/pdf' mime type.
   * Fixes issue where extension-less raw files would silently download instead of opening natively.
   * 
   * @param {Event} e - Click event
   * @param {string} url - The Cloudinary file URL
   */
  const handleViewResume = async (e, url) => {
    e.preventDefault();
    try {
      toast.loading('Opening resume...', { id: 'resume' });
      const response = await fetch(url);
      const blob = await response.blob();
      // Force it to be treated as a PDF so the browser opens it instead of downloading
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const fileUrl = window.URL.createObjectURL(pdfBlob);
      window.open(fileUrl, '_blank');
      toast.success('Opened successfully', { id: 'resume' });
    } catch (error) {
      // Fallback if CORS fails
      toast.dismiss('resume');
      window.open(url, '_blank');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading applications...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {user.role === 'intern' ? 'My Applications' : 'Review Applications'}
      </h2>
      
      <div className="grid gap-4">
        {applications.length === 0 ? (
          <p className="text-gray-500">No applications found.</p>
        ) : (
          applications.map(app => (
            <Card key={app._id}>
              <CardBody className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                      {app.intern.avatar?.url ? (
                        <img src={app.intern.avatar.url} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-xl">
                          {app.intern.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{app.internship.title}</h4>
                      <p className="text-sm text-gray-600 font-medium">Applicant: {app.intern.name} ({app.intern.email})</p>
                      
                      {user.role !== 'intern' && (
                        <div className="mt-2 text-sm text-gray-500 space-y-1">
                          {app.intern.phone && <p>📞 {app.intern.phone}</p>}
                          {app.intern.college && <p>🎓 {app.intern.college}</p>}
                          {app.intern.bio && <p className="italic">"{app.intern.bio}"</p>}
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-500 mt-2"><span className="font-semibold">Cover Letter:</span> {app.coverLetter || 'N/A'}</p>
                      
                      {user.role !== 'intern' && (app.resume?.url || app.intern.resume?.url) && (
                        <a 
                          href={app.resume?.url || app.intern.resume?.url} 
                          onClick={(e) => handleViewResume(e, app.resume?.url || app.intern.resume?.url)}
                          className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
                        >
                          📄 View Candidate Resume
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {app.status.toUpperCase()}
                  </span>
                  
                  {user.role !== 'intern' && app.status === 'pending' && (
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="primary" onClick={() => handleUpdateStatus(app._id, 'accepted')}>Accept</Button>
                      <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(app._id, 'rejected')}>Reject</Button>
                    </div>
                  )}

                  {user.role !== 'intern' && app.status === 'accepted' && (
                    <div className="mt-2">
                      <Button size="sm" variant="outline" onClick={() => handleGenerateCertificate(app)}>
                        Generate Certificate
                      </Button>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationManagement;
