/**
 * @file Profile.jsx
 * @description User profile component that handles displaying and updating user information.
 * Handles specialized file uploads for Cloudinary avatars and resumes via FormData.
 */
import React, { useState } from 'react';
import api from '../../api';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Book, Briefcase, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Profile Component
 */
const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    bio: user.bio || '',
    college: user.college || '',
    department: user.department || '',
  });
  const [avatar, setAvatar] = useState(null);
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * handleUpdate
   * Sends user profile text data updates (e.g. bio, phone) to the backend.
   * 
   * @param {Event} e - Form submit event
   */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/users/${user._id}`, formData);
      toast.success('Profile updated successfully! Refreshing...');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * handleFileUpload
   * Specialized handler for uploading avatars and resumes.
   * Leverages FormData to POST the file to distinct backend upload endpoints.
   * 
   * @param {Event} e - Input change event containing the File
   * @param {string} type - 'avatar' or 'resume'
   */
  const handleUploadFile = async (e, type) => {
    e.preventDefault();
    const file = type === 'avatar' ? avatar : resume;
    if (!file) return toast.error('Please select a file first.');
    
    setIsLoading(true);
    const form = new FormData();
    form.append(type, file);
    try {
      await api.post(`/upload/${type}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(`${type} uploaded successfully! Refreshing...`);
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to upload ${type}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex items-center gap-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
          {user.avatar?.url ? (
            <img src={user.avatar.url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={48} className="text-gray-400" />
          )}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-500 capitalize">{user.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile Information</CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">College / University</label>
                <input name="college" value={formData.college} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department / Major</label>
                <input name="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea name="bio" rows="3" value={formData.bio} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
              </div>
              <Button type="submit" isLoading={isLoading} className="w-full">Save Changes</Button>
            </form>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail size={18} className="text-gray-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Briefcase size={18} className="text-gray-400" />
                <span className="capitalize">{user.role}</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Profile Picture</CardTitle>
            </CardHeader>
            <CardBody>
              <form onSubmit={(e) => handleUploadFile(e, 'avatar')} className="flex items-center gap-4">
                <input type="file" onChange={(e) => setAvatar(e.target.files[0])} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                <Button type="submit" isLoading={isLoading} variant="outline">Upload</Button>
              </form>
            </CardBody>
          </Card>

          {user.role === 'intern' && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Resume</CardTitle>
              </CardHeader>
              <CardBody>
                {user.resume?.url && (
                  <div className="mb-4 text-sm text-green-600 flex items-center gap-2">
                    <FileText size={16} /> Current resume is uploaded!
                  </div>
                )}
                <form onSubmit={(e) => handleUploadFile(e, 'resume')} className="flex items-center gap-4">
                  <input type="file" onChange={(e) => setResume(e.target.files[0])} accept=".pdf,.doc,.docx" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
                  <Button type="submit" isLoading={isLoading} variant="outline">Upload</Button>
                </form>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
