import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Card, CardBody } from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import { Award, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MyCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await api.get('/certificates');
        setCertificates(res.data.data.certificates || res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch certificates', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, [user._id]);

  if (loading) return <div className="p-8 text-center">Loading certificates...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 rounded-xl shadow-lg text-white">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Award size={32} /> My Certificates
        </h2>
        <p className="mt-2 text-purple-100 text-lg">Achievements and proofs of your successful internships.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
            <Award size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-900">No certificates yet.</p>
            <p>Complete an internship to earn your first certificate!</p>
          </div>
        ) : (
          certificates.map(cert => (
            <Card key={cert._id} hover className="overflow-hidden border-2 border-transparent hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-32 bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center border-b border-gray-100">
                <Award size={64} className="text-purple-400 opacity-50" />
              </div>
              <CardBody className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-2">{cert.internship.title}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Company:</span> {cert.internship.company}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Issued:</span> {new Date(cert.issueDate).toLocaleDateString()}
                </p>
                
                <a href={cert.certificateUrl?.url || '#'} target="_blank" rel="noopener noreferrer" className="block w-full">
                  <Button className="w-full flex items-center justify-center gap-2" variant="outline">
                    <Download size={18} /> View / Download
                  </Button>
                </a>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MyCertificates;
