import { Router } from "express";
import { protect } from "../middleware/auth";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController";

const router = Router();

// Every route below requires a valid JWT (see middleware/auth.ts)
router.use(protect);

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
