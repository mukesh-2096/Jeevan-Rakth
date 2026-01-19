import mongoose, { Schema, Document } from 'mongoose';

export interface IBloodCamp extends Document {
  ngoId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode?: string;
  };
  date: Date;
  startTime: string;
  endTime: string;
  targetDonors: number;
  currentDonors: number;
  volunteers: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  facilities: string[];
  contactPerson: {
    name: string;
    phone: string;
    email?: string;
  };
  requirements?: {
    bloodGroup?: string[];
    minimumAge?: number;
    specialInstructions?: string;
  };
  registeredDonors: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const BloodCampSchema: Schema = new Schema(
  {
    ngoId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'NGO ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Camp name is required'],
      trim: true,
      maxlength: [200, 'Camp name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
      },
    },
    date: {
      type: Date,
      required: [true, 'Camp date is required'],
      index: true,
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    targetDonors: {
      type: Number,
      required: [true, 'Target donors is required'],
      min: [1, 'Target donors must be at least 1'],
    },
    currentDonors: {
      type: Number,
      default: 0,
      min: 0,
    },
    volunteers: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
      index: true,
    },
    facilities: {
      type: [String],
      default: [],
    },
    contactPerson: {
      name: {
        type: String,
        required: [true, 'Contact person name is required'],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, 'Contact person phone is required'],
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },
    requirements: {
      bloodGroup: {
        type: [String],
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      },
      minimumAge: {
        type: Number,
        min: 18,
        max: 65,
      },
      specialInstructions: {
        type: String,
        maxlength: [500, 'Special instructions cannot exceed 500 characters'],
      },
    },
    registeredDonors: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
    collection: 'bloodcamps'
  }
);

// Indexes for better query performance
BloodCampSchema.index({ ngoId: 1, status: 1, date: -1 });
BloodCampSchema.index({ status: 1, date: 1 });

// Virtual for progress percentage
BloodCampSchema.virtual('progress').get(function() {
  return this.targetDonors > 0 ? Math.round((this.currentDonors / this.targetDonors) * 100) : 0;
});

// Ensure virtuals are included in JSON
BloodCampSchema.set('toJSON', { virtuals: true });
BloodCampSchema.set('toObject', { virtuals: true });

// Prevent model recompilation during development
export default mongoose.models.BloodCamp || mongoose.model<IBloodCamp>('BloodCamp', BloodCampSchema);
