import { Response } from "express";
import Task from "../models/Task";
import { AuthRequest } from "../middleware/auth";

// GET /api/tasks — all tasks belonging to the logged-in user
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ deadline: 1 });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error fetching tasks" });
  }
};

// POST /api/tasks — create a new task
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dateTime, deadline, priority } = req.body;

    if (!title || !dateTime || !deadline) {
      return res
        .status(400)
        .json({ message: "title, dateTime and deadline are required" });
    }

    const task = await Task.create({
      user: req.userId,
      title,
      description,
      dateTime,
      deadline,
      priority,
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error creating task" });
  }
};

// PATCH /api/tasks/:id — update a task (e.g. mark complete, edit fields)
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    Object.assign(task, req.body);
    await task.save();

    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error updating task" });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error deleting task" });
  }
};
