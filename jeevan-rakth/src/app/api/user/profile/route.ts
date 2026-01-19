import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import ContactDetails from '@/models/ContactDetails';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Fetch complete user profile from database using email
    const userProfile = await User.findOne({ email: user.email }).select('-password');

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch contact details from separate collection
    let contactDetails = await ContactDetails.findOne({ userId: userProfile._id });

    // Migration: If no contact details exist, create an empty one
    if (!contactDetails) {
      console.log('No contact details found, creating new record...');
      contactDetails = await ContactDetails.create({
        userId: userProfile._id,
        role: userProfile.role,
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userProfile._id,
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone || '',
        role: userProfile.role,
        dateOfBirth: contactDetails?.dateOfBirth || '',
        gender: contactDetails?.gender || '',
        governmentIdType: contactDetails?.governmentIdType || '',
        governmentIdNumber: contactDetails?.governmentIdNumber || '',
        bloodGroup: contactDetails?.bloodGroup || '',
        weight: contactDetails?.weight || '',
        address: contactDetails?.address || {
          street: '',
          city: '',
          district: '',
          state: '',
          pincode: '',
        },
        // NGO-specific fields
        registrationNumber: contactDetails?.registrationNumber || '',
        description: contactDetails?.description || '',
        // Hospital-specific fields
        hospitalName: contactDetails?.hospitalName || '',
        licenseNumber: contactDetails?.licenseNumber || '',
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    console.log('Current user from token:', user); // Debug log

    if (!user) {
      console.log('No user found - unauthorized'); // Debug log
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Received profile update:', body); // Debug log
    
    const {
      dateOfBirth,
      gender,
      governmentIdType,
      governmentIdNumber,
      bloodGroup,
      weight,
      address,
      registrationNumber,
      description,
      hospitalName,
      licenseNumber,
    } = body;

    await dbConnect();
    console.log('Database connected'); // Debug log

    // Get user to obtain userId
    const userProfile = await User.findOne({ email: user.email }).select('-password');
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate age from date of birth
    let calculatedAge;
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
    }

    // Update or create contact details in separate collection
    const contactDetails = await ContactDetails.findOneAndUpdate(
      { userId: userProfile._id },
      {
        dateOfBirth,
        age: calculatedAge,
        gender,
        governmentIdType,
        governmentIdNumber,
        bloodGroup,
        weight,
        address,
        registrationNumber,
        description,
        hospitalName,
        licenseNumber,
      },
      { new: true, upsert: true, runValidators: true }
    );

    console.log('Updated contact details:', contactDetails); // Debug log

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: userProfile._id,
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone || '',
        role: userProfile.role,
        dateOfBirth: contactDetails?.dateOfBirth || '',
        gender: contactDetails?.gender || '',
        governmentIdType: contactDetails?.governmentIdType || '',
        governmentIdNumber: contactDetails?.governmentIdNumber || '',
        bloodGroup: contactDetails?.bloodGroup || '',
        weight: contactDetails?.weight || '',
        address: contactDetails?.address || {
          street: '',
          city: '',
          district: '',
          state: '',
          pincode: '',
        },
        registrationNumber: contactDetails?.registrationNumber || '',
        description: contactDetails?.description || '',
        hospitalName: contactDetails?.hospitalName || '',
        licenseNumber: contactDetails?.licenseNumber || '',
      },
    });
  } catch (error: unknown) {
    console.error('Profile update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
    console.error('Error details:', errorMessage); // Debug log
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// PATCH handler (same as POST for backward compatibility)
export async function PATCH(request: NextRequest) {
  return POST(request);
}
