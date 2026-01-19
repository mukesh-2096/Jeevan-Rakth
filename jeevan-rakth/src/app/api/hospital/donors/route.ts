import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';
// Import User to ensure the model is registered for populate
import '@/models/User';

// GET - Fetch all active/approved donors for hospital
export async function GET() {
  try {
    // Verify authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        donors: [],
        count: 0 
      }, { status: 401 });
    }

    // Verify user is a hospital
    if (currentUser.role !== 'hospital') {
      return NextResponse.json({ 
        error: 'Access denied. Hospital role required.',
        donors: [],
        count: 0 
      }, { status: 403 });
    }

    await dbConnect();

    // Get all approved and donated donors
    const registrations = await Registration.find({ 
      status: { $in: ['approved', 'donated'] } 
    })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    console.log(`Found ${registrations.length} active donors`);

    // Transform data to match frontend Donor format
    const donors = registrations.map((reg: any) => {
      const initials = reg.fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      // Calculate days since last donation
      const lastDonationDate = reg.lastDonationDate 
        ? new Date(reg.lastDonationDate)
        : null;
      
      const daysSinceLastDonation = lastDonationDate
        ? Math.floor((Date.now() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      // Determine availability status based on blood donation eligibility (56 days for whole blood)
      const isAvailable = !lastDonationDate || daysSinceLastDonation! >= 56;

      return {
        id: reg._id.toString(),
        name: reg.fullName,
        initials,
        bloodType: reg.bloodGroup,
        phone: reg.mobileNumber,
        email: reg.userId?.email || 'N/A',
        location: `${reg.city}, ${reg.state}`,
        lastDonation: lastDonationDate 
          ? lastDonationDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
          : 'Never',
        totalDonations: reg.firstDonation === 'No' ? 1 : 0, // Can be updated later with actual donation tracking
        status: isAvailable ? 'Available' : 'Not Available',
        donationStatus: reg.status, // 'approved' or 'donated'
        avatar: 'bg-red-500', // Default color, can be randomized
      };
    });

    return NextResponse.json({ 
      donors,
      count: donors.length,
      stats: {
        total: donors.length,
        available: donors.filter(d => d.status === 'Available').length,
        unavailable: donors.filter(d => d.status === 'Not Available').length,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Get active donors error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch active donors',
        donors: [],
        count: 0 
      },
      { status: 500 }
    );
  }
}
