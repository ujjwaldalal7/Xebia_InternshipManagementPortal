import TaskService from '../services/taskService.js';
import { successResponse  } from '../utils/responseFormatter.js';

export const createTask = async (req, res, next) => {
  try {
    const task = await TaskService.createTask(req.body, req.user);
    successResponse(res, 201, 'Task created', task);
  } catch (error) { next(error); }
};

export const getTasks = async (req, res, next) => {
  try {
    const result = await TaskService.getTasks(req.query, req.user);
    successResponse(res, 200, 'Tasks retrieved', result);
  } catch (error) { next(error); }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await TaskService.getTaskById(req.params.id, req.user);
    successResponse(res, 200, 'Task retrieved', task);
  } catch (error) { next(error); }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await TaskService.updateTask(req.params.id, req.body, req.user);
    successResponse(res, 200, 'Task updated', task);
  } catch (error) { next(error); }
};

export const gradeTask = async (req, res, next) => {
  try {
    const task = await TaskService.gradeTask(req.params.id, req.body, req.user);
    successResponse(res, 200, 'Task graded', task);
  } catch (error) { next(error); }
};
