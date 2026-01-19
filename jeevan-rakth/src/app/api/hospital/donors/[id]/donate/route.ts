import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';

// PATCH - Mark a donor as having donated
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a hospital
    if (currentUser.role !== 'hospital') {
      return NextResponse.json({ error: 'Access denied. Hospital role required.' }, { status: 403 });
    }

    await dbConnect();

    const { id } = await params;
    const body = await request.json();
    const { donationDate } = body;

    // Find the registration
    const registration = await Registration.findById(id);
    if (!registration) {
      return NextResponse.json({ error: 'Donor registration not found' }, { status: 404 });
    }

    if (registration.status !== 'approved') {
      return NextResponse.json({ 
        error: 'Only approved donors can be marked as donated',
        currentStatus: registration.status 
      }, { status: 400 });
    }

    // Update status to donated and set last donation date
    registration.status = 'donated';
    registration.lastDonationDate = donationDate ? new Date(donationDate) : new Date();
    await registration.save();

    return NextResponse.json({
      message: 'Donor marked as donated successfully',
      registration: {
        id: registration._id,
        status: registration.status,
        lastDonationDate: registration.lastDonationDate,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Mark as donated error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to mark as donated' },
      { status: 500 }
    );
  }
}
