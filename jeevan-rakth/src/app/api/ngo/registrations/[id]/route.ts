import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';
import User from '@/models/User';
import Notification from '@/models/Notification';

// PATCH - Approve or reject a registration
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (currentUser.role !== 'ngo') {
      return NextResponse.json({ error: 'Access denied. NGO role required.' }, { status: 403 });
    }

    await dbConnect();

    const params = await context.params;
    const { id } = params;
    const { action } = await request.json();

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const registration = await Registration.findById(id);

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    if (registration.organization.toString() !== currentUser.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    registration.status = newStatus;
    await registration.save();

    // Get NGO details for notification
    const ngoUser = await User.findById(currentUser.id).select('name');
    const ngoName = ngoUser?.name || 'NGO';

    // Create notification for the donor
    await Notification.create({
      userId: registration.userId,
      title: action === 'approve' ? '✅ Registration Approved' : '❌ Registration Rejected',
      message: action === 'approve'
        ? `Your registration request has been approved by ${ngoName}. You can now proceed with blood donation.`
        : `Your registration request has been rejected by ${ngoName}.`,
      type: action === 'approve' ? 'success' : 'warning',
      organizationName: ngoName,
      organizationType: 'NGO',
      isRead: false,
    });

    return NextResponse.json({
      message: `Registration ${action}d successfully`,
      registration,
    });

  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    );
  }
}

// DELETE - Mark as donated
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (currentUser.role !== 'ngo') {
      return NextResponse.json({ error: 'Access denied. NGO role required.' }, { status: 403 });
    }

    await dbConnect();

    const params = await context.params;
    const { id } = params;

    const registration = await Registration.findById(id);

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    if (registration.organization.toString() !== currentUser.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (registration.status !== 'approved') {
      return NextResponse.json({ error: 'Only approved registrations can be marked as donated' }, { status: 400 });
    }

    registration.status = 'donated';
    registration.lastDonationDate = new Date();
    await registration.save();

    // Get NGO details for notification
    const ngoUser = await User.findById(currentUser.id).select('name');
    const ngoName = ngoUser?.name || 'NGO';

    // Create notification for the donor
    await Notification.create({
      userId: registration.userId,
      title: '🎉 Donation Completed',
      message: `Thank you for your blood donation at ${ngoName}! Your contribution will help save lives.`,
      type: 'success',
      organizationName: ngoName,
      organizationType: 'NGO',
      isRead: false,
    });

    return NextResponse.json({
      message: 'Registration marked as donated successfully',
      registration,
    });

  } catch (error) {
    console.error('Error marking as donated:', error);
    return NextResponse.json(
      { error: 'Failed to mark as donated' },
      { status: 500 }
    );
  }
}
