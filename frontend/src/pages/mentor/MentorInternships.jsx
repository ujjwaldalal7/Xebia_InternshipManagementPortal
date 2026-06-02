import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';

const MentorInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    domain: '',
    location: '',
    type: 'remote',
    description: '',
    stipendAmount: '',
    durationValue: '',
    durationUnit: 'months',
    totalSeats: '',
    deadline: '',
  });

  const fetchInternships = async () => {
    try {
      const res = await api.get('/internships');
      // The backend returns all internships for intern, but for mentor it might just return all for now 
      // depending on backend implementation. Let's filter client-side just in case, or assume backend handles it.
      setInternships(res.data.data.internships);
    } catch (error) {
      console.error('Failed to fetch internships', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        company: formData.company,
        domain: formData.domain,
        location: formData.location,
        type: formData.type,
        description: formData.description,
        stipend: { amount: Number(formData.stipendAmount), currency: 'INR' },
        duration: { value: Number(formData.durationValue), unit: formData.durationUnit },
        totalSeats: Number(formData.totalSeats),
        deadline: formData.deadline,
      };

      if (editingId) {
        await api.put(`/internships/${editingId}`, payload);
        toast.success();
      } else {
        await api.post('/internships', payload);
        toast.success();
      }

      setShowForm(false);
      setEditingId(null);
      fetchInternships();
    } catch (error) {
      toast.success();
    }
  };

  const handleEdit = (internship) => {
    setFormData({
      title: internship.title || '',
      company: internship.company || '',
      domain: internship.domain || '',
      location: internship.location || '',
      type: internship.type || 'remote',
      description: internship.description || '',
      stipendAmount: internship.stipend?.amount || '',
      durationValue: internship.duration?.value || '',
      durationUnit: internship.duration?.unit || 'months',
      totalSeats: internship.totalSeats || '',
      deadline: internship.deadline ? internship.deadline.substring(0, 10) : '',
    });
    setEditingId(internship._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship?')) return;
    try {
      await api.delete(`/internships/${id}`);
      fetchInternships();
    } catch (error) {
      toast.success();
    }
  };

  if (loading) return <div className="p-8 text-center">Loading internships...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Internships</h2>
        <Button onClick={() => {
          if (showForm) {
            setShowForm(false);
            setEditingId(null);
          } else {
            setFormData({
              title: '', company: '', domain: '', location: '', type: 'remote',
              description: '', stipendAmount: '', durationValue: '', durationUnit: 'months',
              totalSeats: '', deadline: ''
            });
            setShowForm(true);
          }
        }}>
          {showForm ? 'Cancel' : '+ Create Internship'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Internship' : 'Post a New Internship'}</CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input name="title" required value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <input name="company" required value={formData.company} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Domain</label>
                  <input name="domain" required value={formData.domain} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. Software Engineering" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input name="location" required value={formData.location} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="remote">Remote</option>
                    <option value="onsite">Onsite</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stipend Amount (INR)</label>
                  <input name="stipendAmount" type="number" required value={formData.stipendAmount} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration Value</label>
                  <input name="durationValue" type="number" required value={formData.durationValue} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Seats</label>
                  <input name="totalSeats" type="number" required value={formData.totalSeats} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deadline</label>
                  <input name="deadline" type="date" required value={formData.deadline} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" required rows="3" value={formData.description} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map(internship => (
          <Card key={internship._id}>
            <CardBody>
              <h3 className="font-bold text-lg">{internship.title}</h3>
              <p className="text-sm text-gray-600">{internship.company}</p>
              <p className="text-sm mt-2">Status: <span className="font-semibold">{internship.status}</span></p>
              <p className="text-sm">Seats: {internship.filledSeats} / {internship.totalSeats}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={() => handleEdit(internship)} className="text-sm py-1 px-3">Edit</Button>
                <button onClick={() => handleDelete(internship._id)} className="text-sm text-red-600 hover:text-red-800 ml-auto">Delete</button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MentorInternships;
