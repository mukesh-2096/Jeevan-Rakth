import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';
import Notification from '@/models/Notification';
import User from '@/models/User';
import '@/models/User'; // Side-effect import

// PATCH - Approve or reject a donor registration
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

    const { action } = await request.json(); // 'approve' or 'reject'
    const { id } = await params;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be "approve" or "reject"' }, { status: 400 });
    }

    // Find the registration
    const registration = await Registration.findById(id);
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    if (registration.status !== 'requested') {
      return NextResponse.json({ error: 'Registration has already been processed' }, { status: 400 });
    }

    // Update status based on action
    if (action === 'approve') {
      registration.status = 'approved';
      await registration.save();

      // Get hospital/organization details
      const hospital = await User.findById(currentUser.id);
      const organizationName = hospital?.name || 'Hospital';

      // Create notification for the donor
      await Notification.create({
        userId: registration.userId,
        title: 'Registration Approved',
        message: `Your registration request has been accepted by ${organizationName}. You are now an approved donor!`,
        type: 'success',
        relatedEntity: {
          type: 'registration',
          id: registration._id,
        },
        organizationName,
        organizationType: currentUser.role,
        isRead: false,
      });

      return NextResponse.json({
        message: 'Registration approved successfully',
        registration: {
          id: registration._id,
          status: registration.status,
        }
      }, { status: 200 });
    } else {
      // For rejection, mark as rejected
      registration.status = 'rejected';
      await registration.save();

      // Get hospital/organization details
      const hospital = await User.findById(currentUser.id);
      const organizationName = hospital?.name || 'Hospital';

      // Create notification for the donor
      await Notification.create({
        userId: registration.userId,
        title: 'Registration Not Approved',
        message: `Your registration request was not approved by ${organizationName}. Please contact them for more information.`,
        type: 'warning',
        relatedEntity: {
          type: 'registration',
          id: registration._id,
        },
        organizationName,
        organizationType: currentUser.role,
        isRead: false,
      });

      return NextResponse.json({
        message: 'Registration rejected',
        registration: {
          id: registration._id,
          status: registration.status,
        }
      }, { status: 200 });
    }

  } catch (error) {
    console.error('Update registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update registration' },
      { status: 500 }
    );
  }
}
