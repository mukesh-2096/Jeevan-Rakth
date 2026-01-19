import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  relatedEntity?: {
    type: 'registration' | 'donation' | 'request';
    id: mongoose.Types.ObjectId;
  };
  organizationName?: string;
  organizationType?: 'hospital' | 'ngo';
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info',
  },
  relatedEntity: {
    type: {
      type: String,
      enum: ['registration', 'donation', 'request'],
    },
    id: {
      type: Schema.Types.ObjectId,
    },
  },
  organizationName: {
    type: String,
  },
  organizationType: {
    type: String,
    enum: ['hospital', 'ngo'],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });

const Notification: Model<INotification> = 
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
