import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const data = await request.json();

    // Create registration with userId from authenticated user
    const registration = await Registration.create({
      userId: currentUser.id,
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      mobileNumber: data.mobileNumber,
      bloodGroup: data.bloodGroup,
      weight: data.weight,
      firstDonation: data.firstDonation,
      lastDonationDate: data.lastDonationDate,
      currentMedication: data.currentMedication,
      medicationDetails: data.medicationDetails,
      majorIllness: data.majorIllness,
      illnessDetails: data.illnessDetails,
      state: data.state,
      district: data.district,
      city: data.city,
      pincode: data.pincode,
      donationRadius: data.donationRadius,
      availableDays: data.availableDays,
      contactMethod: data.contactMethod,
      consentAccuracy: data.consentAccuracy,
      consentContact: data.consentContact,
      status: 'pending',
    });

    return NextResponse.json({
      message: 'Registration submitted successfully',
      registration: {
        id: registration._id,
        status: registration.status,
        createdAt: registration.createdAt,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit registration' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Verify authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get all registrations for this user
    const registrations = await Registration.find({ userId: currentUser.id })
      .sort({ createdAt: -1 });

    return NextResponse.json({ registrations }, { status: 200 });

  } catch (error) {
    console.error('Get registrations error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}
