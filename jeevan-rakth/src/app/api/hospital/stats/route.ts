import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';
import '@/models/User';

// GET - Fetch hospital dashboard statistics
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (currentUser.role !== 'hospital') {
      return NextResponse.json({ error: 'Access denied. Hospital role required.' }, { status: 403 });
    }

    await dbConnect();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get total donors (approved + donated)
    const totalDonorsCount = await Registration.countDocuments({
      status: { $in: ['approved', 'donated'] }
    });

    // Get active donors (approved only, can still donate)
    const activeDonorsCount = await Registration.countDocuments({
      status: 'approved'
    });

    // Get pending requests
    const pendingRequestsCount = await Registration.countDocuments({
      status: 'requested'
    });

    // Get total donations (donated status)
    const totalDonationsCount = await Registration.countDocuments({
      status: 'donated'
    });

    // Get approved today
    const approvedTodayCount = await Registration.countDocuments({
      status: { $in: ['approved', 'donated'] },
      updatedAt: { $gte: startOfToday }
    });

    // Get donated today
    const donatedTodayCount = await Registration.countDocuments({
      status: 'donated',
      lastDonationDate: { $gte: startOfToday }
    });

    return NextResponse.json({
      totalDonors: totalDonorsCount,
      activeDonors: activeDonorsCount,
      pendingRequests: pendingRequestsCount,
      totalDonations: totalDonationsCount,
      approvedToday: approvedTodayCount,
      donatedToday: donatedTodayCount,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching hospital stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
