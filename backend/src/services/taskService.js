import Task from '../models/Task.js';
import Application from '../models/Application.js';
import AppError from '../utils/AppError.js';

class TaskService {
  static async createTask(data, user) {
    const acceptedApp = await Application.findOne({
      intern: data.assignedTo, internship: data.internship, status: 'accepted',
    });
    if (!acceptedApp) throw new AppError('Intern not accepted for this internship', 400);
    const task = await Task.create({ ...data, assignedBy: user._id });
    return await task.populate([
      { path: 'assignedTo', select: 'name email avatar' },
      { path: 'internship', select: 'title company' },
    ]);
  }

  static async getTasks(query = {}, user) {
    const { status, internshipId, page = 1, limit = 10 } = query;
    const filter = {};
    if (user.role === 'intern') filter.assignedTo = user._id;
    else if (user.role === 'mentor') filter.assignedBy = user._id;
    if (status) filter.status = status;
    if (internshipId) filter.internship = internshipId;
    const skip = (page - 1) * limit;
    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email avatar')
      .populate('assignedBy', 'name email')
      .populate('internship', 'title company')
      .sort({ dueDate: 1 }).skip(skip).limit(parseInt(limit));
    return { tasks, pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) } };
  }

  static async getTaskById(id, user) {
    const task = await Task.findById(id)
      .populate('assignedTo', 'name email avatar')
      .populate('assignedBy', 'name email')
      .populate('internship', 'title company');
    if (!task) throw new AppError('Task not found', 404);
    if (user.role === 'intern' && task.assignedTo._id.toString() !== user._id.toString())
      throw new AppError('Not authorized', 403);
    return task;
  }

  static async updateTask(id, updateData, user) {
    const task = await Task.findById(id);
    if (!task) throw new AppError('Task not found', 404);
    if (user.role === 'mentor' || user.role === 'admin') {
      Object.assign(task, updateData);
    } else if (user.role === 'intern') {
      if (task.assignedTo.toString() !== user._id.toString()) throw new AppError('Not authorized', 403);
      if (updateData.status) task.status = updateData.status;
      if (updateData.submission) { task.submission = { ...updateData.submission, submittedAt: new Date() }; task.status = 'submitted'; }
    }
    await task.save();
    return await task.populate([{ path: 'assignedTo', select: 'name email avatar' }, { path: 'internship', select: 'title company' }]);
  }

  static async gradeTask(id, gradeData, user) {
    const task = await Task.findById(id);
    if (!task) throw new AppError('Task not found', 404);
    if (task.status !== 'submitted') throw new AppError('Can only grade submitted tasks', 400);
    task.grade = { score: gradeData.score, feedback: gradeData.feedback || '', gradedAt: new Date() };
    task.status = 'reviewed';
    await task.save();
    return await task.populate([{ path: 'assignedTo', select: 'name email avatar' }, { path: 'internship', select: 'title company' }]);
  }
}

export default TaskService;
