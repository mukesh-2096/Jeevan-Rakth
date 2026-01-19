import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';
// Import User to ensure the model is registered for populate
import '@/models/User';
import mongoose from 'mongoose';

// GET - Fetch all pending donor registrations for hospital
export async function GET() {
  try {
    // Verify authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        pendingRegistrations: [],
        count: 0 
      }, { status: 401 });
    }

    // Verify user is a hospital
    if (currentUser.role !== 'hospital') {
      return NextResponse.json({ 
        error: 'Access denied. Hospital role required.',
        pendingRegistrations: [],
        count: 0 
      }, { status: 403 });
    }

    await dbConnect();

    // Get ALL pending registrations with user details (no date limit - includes all historical pending requests)
    const registrations = await Registration.find({ status: 'requested' })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    console.log(`Found ${registrations.length} pending registrations`);

    // Transform data to match frontend format
    const pendingRegistrations = registrations.map((reg: any) => {
      const age = reg.dateOfBirth 
        ? Math.floor((Date.now() - new Date(reg.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : 0;

      const submittedAt = getRelativeTime(new Date(reg.createdAt));

      return {
        id: reg._id.toString(),
        name: reg.fullName,
        bloodType: reg.bloodGroup,
        phone: reg.mobileNumber,
        email: reg.userId?.email || 'N/A',
        location: `${reg.city}, ${reg.state}`,
        age,
        gender: reg.gender,
        submittedAt,
        registrationData: {
          weight: reg.weight,
          firstDonation: reg.firstDonation,
          lastDonationDate: reg.lastDonationDate,
          currentMedication: reg.currentMedication,
          medicationDetails: reg.medicationDetails,
          majorIllness: reg.majorIllness,
          illnessDetails: reg.illnessDetails,
          district: reg.district,
          pincode: reg.pincode,
          donationRadius: reg.donationRadius,
          availableDays: reg.availableDays,
          contactMethod: reg.contactMethod,
        }
      };
    });

    return NextResponse.json({ 
      pendingRegistrations,
      count: pendingRegistrations.length 
    }, { status: 200 });

  } catch (error) {
    console.error('Get pending registrations error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch pending registrations',
        pendingRegistrations: [],
        count: 0 
      },
      { status: 500 }
    );
  }
}

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
}
