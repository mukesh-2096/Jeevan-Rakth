import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Registration from '@/models/Registration';
import ContactDetails from '@/models/ContactDetails';
import '@/models/User'; // Side-effect import to ensure User model is registered

export async function POST(request: Request) {
  try {
    // Check if user is authenticated and is a hospital
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    if (currentUser.role !== 'hospital') {
      return NextResponse.json(
        { error: 'Forbidden - Only hospitals can add donors' },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    const {
      fullName,
      dateOfBirth,
      gender,
      mobileNumber,
      email,
      bloodGroup,
      weight,
      state,
      district,
      city,
      pincode,
    } = body;

    // Validate required fields
    if (!fullName || !dateOfBirth || !gender || !mobileNumber || !email || 
        !bloodGroup || !weight || !state || !district || !city || !pincode) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create a new user account for the donor
      user = await User.create({
        name: fullName,
        email,
        password: 'hospital-added-' + Date.now(), // Temporary password
        role: 'donor',
        phone: mobileNumber,
        dateOfBirth,
        gender,
        bloodGroup,
        weight: parseFloat(weight),
      });

      // Create contact details
      await ContactDetails.create({
        userId: user._id,
        address: {
          state,
          district,
          city,
          pincode,
        },
      });
    } else {
      // Check if user is already a donor
      if (user.role !== 'donor') {
        return NextResponse.json(
          { error: 'User exists with a different role' },
          { status: 400 }
        );
      }

      // Update user information
      user.name = fullName;
      user.phone = mobileNumber;
      user.dateOfBirth = dateOfBirth;
      user.gender = gender;
      user.bloodGroup = bloodGroup;
      user.weight = parseFloat(weight);
      await user.save();

      // Update or create contact details
      await ContactDetails.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          address: {
            state,
            district,
            city,
            pincode,
          },
        },
        { upsert: true }
      );
    }

    // Create registration with 'approved' status (hospital-added donors are pre-approved)
    const registration = await Registration.create({
      userId: user._id,
      fullName,
      dateOfBirth,
      gender,
      mobileNumber,
      bloodGroup,
      weight: parseFloat(weight),
      state,
      district,
      city,
      pincode,
      firstDonation: 'Yes', // Default to first time donor
      majorSurgery: 'No',
      chronicIllness: 'No',
      currentMedication: 'No',
      recentTattoo: 'No',
      pregnant: gender === 'Female' ? 'No' : undefined,
      availableForEmergency: 'Yes',
      preferredDonationCenter: 'Any',
      consent: true,
      status: 'approved', // Hospital-added donors are pre-approved
      createdAt: new Date(),
      lastDonationDate: null,
    });

    return NextResponse.json(
      { 
        message: 'Donor added successfully',
        donor: {
          id: registration._id.toString(),
          name: fullName,
          email,
          bloodGroup,
          phone: mobileNumber,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding donor:', error);
    return NextResponse.json(
      { error: 'Failed to add donor' },
      { status: 500 }
    );
  }
}
