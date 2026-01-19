import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistration extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  dateOfBirth: Date;
  gender: string;
  mobileNumber: string;
  bloodGroup: string;
  weight: number;
  firstDonation: string;
  lastDonationDate?: Date;
  currentMedication: string;
  medicationDetails?: string;
  majorIllness: string;
  illnessDetails?: string;
  state: string;
  district: string;
  city: string;
  pincode: string;
  donationRadius: string;
  availableDays: string[];
  contactMethod: string;
  consentAccuracy: boolean;
  consentContact: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'],
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A−', 'B+', 'B−', 'O+', 'O−', 'AB+', 'AB−'],
  },
  weight: {
    type: Number,
    required: true,
  },
  firstDonation: {
    type: String,
    required: true,
    enum: ['Yes', 'No'],
  },
  lastDonationDate: {
    type: Date,
  },
  currentMedication: {
    type: String,
    required: true,
    enum: ['Yes', 'No'],
  },
  medicationDetails: {
    type: String,
  },
  majorIllness: {
    type: String,
    required: true,
    enum: ['Yes', 'No'],
  },
  illnessDetails: {
    type: String,
  },
  state: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  donationRadius: {
    type: String,
    required: true,
  },
  availableDays: {
    type: [String],
    required: true,
  },
  contactMethod: {
    type: String,
    required: true,
    enum: ['Phone', 'SMS', 'WhatsApp', 'Email'],
  },
  consentAccuracy: {
    type: Boolean,
    required: true,
  },
  consentContact: {
    type: Boolean,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['requested', 'approved', 'donated', 'rejected', 'inactive'],
    default: 'requested',
  },
}, {
  timestamps: true,
});

// Prevent model recompilation during hot-reload in development
export default mongoose.models.Registration || mongoose.model<IRegistration>('Registration', RegistrationSchema);
