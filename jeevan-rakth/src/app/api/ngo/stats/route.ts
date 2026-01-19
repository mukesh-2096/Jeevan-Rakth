import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';

// GET - Fetch NGO statistics
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (currentUser.role !== 'ngo') {
      return NextResponse.json({ error: 'Access denied. NGO role required.' }, { status: 403 });
    }

    await dbConnect();

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch all statistics
    const totalDonors = await Registration.countDocuments({
      organization: currentUser.id,
    });

    const activeDonors = await Registration.countDocuments({
      organization: currentUser.id,
      status: 'approved',
    });

    const pendingRequests = await Registration.countDocuments({
      organization: currentUser.id,
      status: 'requested',
    });

    const totalDonations = await Registration.countDocuments({
      organization: currentUser.id,
      status: 'donated',
    });

    const approvedToday = await Registration.countDocuments({
      organization: currentUser.id,
      status: 'approved',
      updatedAt: { $gte: today, $lt: tomorrow },
    });

    const donatedToday = await Registration.countDocuments({
      organization: currentUser.id,
      status: 'donated',
      updatedAt: { $gte: today, $lt: tomorrow },
    });

    return NextResponse.json({
      totalDonors,
      activeDonors,
      pendingRequests,
      totalDonations,
      approvedToday,
      donatedToday,
      upcomingDrives: 0, // Placeholder for future blood drives feature
      completedDrives: 0, // Placeholder for future blood drives feature
    });

  } catch (error) {
    console.error('Error fetching NGO stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
