import mongoose, { Document, Schema, Types } from "mongoose";

export type Priority = "Low" | "Medium" | "High";

export interface ITask extends Document {
  user: Types.ObjectId;
  title: string;
  description?: string;
  dateTime: Date; // when the task is scheduled for
  deadline: Date; // due date
  priority: Priority;
  completed: boolean;
}

const TaskSchema = new Schema<ITask>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    dateTime: { type: Date, required: true },
    deadline: { type: Date, required: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>("Task", TaskSchema);
