import mongoose from 'mongoose';

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum Status {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED'
}

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, maxLength: 100, required: true },
    description: String,
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: Object.values(Priority), required: true },
    status: { type: String, enum: Object.values(Status), default: Status.TODO },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedToId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const Task = mongoose.model('Task', taskSchema);
