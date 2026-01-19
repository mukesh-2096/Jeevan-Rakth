import mongoose, { Schema, Document } from 'mongoose';

export interface IContactDetails extends Document {
  userId: mongoose.Types.ObjectId;
  role: 'donor' | 'hospital' | 'ngo';
  age?: number;
  dateOfBirth?: string;
  gender?: string;
  weight?: string;
  governmentIdType?: string;
  governmentIdNumber?: string;
  bloodGroup?: string;
  address?: {
    street?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
  };
  // NGO-specific fields
  registrationNumber?: string;
  description?: string;
  // Hospital-specific fields
  hospitalName?: string;
  licenseNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactDetailsSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['donor', 'hospital', 'ngo'],
    },
    age: {
      type: Number,
    },
    dateOfBirth: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    weight: {
      type: String,
    },
    governmentIdType: {
      type: String,
      enum: ['Aadhaar', 'Voter ID', 'Driving License'],
    },
    governmentIdNumber: {
      type: String,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A−', 'B+', 'B−', 'O+', 'O−', 'AB+', 'AB−'],
    },
    address: {
      street: { type: String },
      city: { type: String },
      district: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    // NGO-specific fields
    registrationNumber: {
      type: String,
    },
    description: {
      type: String,
    },
    // Hospital-specific fields
    hospitalName: {
      type: String,
    },
    licenseNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during development
export default mongoose.models.ContactDetails || mongoose.model<IContactDetails>('ContactDetails', ContactDetailsSchema);
