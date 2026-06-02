import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import { useAuth } from '../../context/AuthContext';

const TaskManagement = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', dueDate: '', assignedTo: '', internship: '' });

  const fetchData = async () => {
    try {
      const [tasksRes, appsRes] = await Promise.all([
        api.get('/tasks'),
        user.role !== 'intern' ? api.get('/applications') : Promise.resolve({ data: { data: { applications: [] } } })
      ]);
      setTasks(tasksRes.data.data.tasks);
      if (user.role !== 'intern') {
        const acceptedApps = appsRes.data.data.applications.filter(app => app.status === 'accepted');
        setApplications(acceptedApps);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.role]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      fetchData();
    } catch (error) {
      toast.success();
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.assignedTo) return toast.success();
    try {
      const app = applications.find(a => a.intern._id === formData.assignedTo);
      await api.post('/tasks', {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        assignedTo: formData.assignedTo,
        internship: app.internship._id,
      });
      toast.success();
      setShowForm(false);
      setFormData({ title: '', description: '', dueDate: '', assignedTo: '', internship: '' });
      fetchData();
    } catch (error) {
      toast.success();
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchData();
    } catch (error) {
      toast.success();
    }
  };

  if (loading) return <div className="p-8 text-center">Loading tasks...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
        {user.role !== 'intern' && (
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Create Task'}
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Assign a New Task</CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Intern</label>
                <select 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.assignedTo}
                  onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
                  required
                >
                  <option value="">-- Choose Intern --</option>
                  {applications.map(app => (
                    <option key={app.intern._id} value={app.intern._id}>
                      {app.intern.name} ({app.internship.title})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Task Title</label>
                <input required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input type="date" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea required rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
              </div>
              <Button type="submit">Assign Task</Button>
            </form>
          </CardBody>
        </Card>
      )}
      
      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks found.</p>
        ) : (
          tasks.map(task => (
            <Card key={task._id}>
              <CardBody className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Assigned to: {task.assignedTo.name} | Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status.toUpperCase()}
                  </span>
                  
                  {user.role === 'intern' && task.status === 'pending' && (
                    <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(task._id, 'in-progress')} className="mt-2">Start Task</Button>
                  )}
                  {user.role === 'intern' && task.status === 'in-progress' && (
                    <Button size="sm" variant="primary" onClick={() => handleUpdateStatus(task._id, 'submitted')} className="mt-2">Submit</Button>
                  )}
                  {user.role !== 'intern' && task.status === 'submitted' && (
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="primary" onClick={() => handleUpdateStatus(task._id, 'completed')}>Approve</Button>
                      <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(task._id, 'in-progress')}>Reject</Button>
                    </div>
                  )}
                  {user.role !== 'intern' && (
                    <button onClick={() => handleDeleteTask(task._id)} className="text-red-600 hover:text-red-800 text-sm mt-4">
                      Delete Task
                    </button>
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

export default TaskManagement;
