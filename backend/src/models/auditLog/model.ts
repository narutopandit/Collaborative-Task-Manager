import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
