import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: 'donor' | 'hospital' | 'ngo';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      required: [true, 'Please specify a role'],
      enum: ['donor', 'hospital', 'ngo'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during development
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
