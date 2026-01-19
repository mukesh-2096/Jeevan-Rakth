import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';
import '@/models/User';

// GET - Fetch blood inventory grouped by blood type
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

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const inventory = [];

    for (const bloodType of bloodTypes) {
      // Count donated blood units (completed donations)
      const donatedCount = await Registration.countDocuments({
        bloodGroup: bloodType,
        status: 'donated'
      });

      // Count available donors (approved but not yet donated)
      const availableCount = await Registration.countDocuments({
        bloodGroup: bloodType,
        status: 'approved'
      });

      // Get last donation date
      const lastDonation = await Registration.findOne({
        bloodGroup: bloodType,
        status: 'donated',
        lastDonationDate: { $exists: true, $ne: null }
      })
        .sort({ lastDonationDate: -1 })
        .select('lastDonationDate')
        .lean();

      const totalUnits = donatedCount; // Only count completed donations as inventory
      
      // Determine status based on units
      let status = 'Critical';
      if (totalUnits >= 50) {
        status = 'Good';
      } else if (totalUnits >= 20) {
        status = 'Low';
      }

      // Format last donation date
      let lastDonationFormatted = 'N/A';
      if (lastDonation?.lastDonationDate) {
        const date = new Date(lastDonation.lastDonationDate);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
          lastDonationFormatted = 'Today';
        } else if (diffDays === 1) {
          lastDonationFormatted = 'Yesterday';
        } else if (diffDays < 7) {
          lastDonationFormatted = `${diffDays} days ago`;
        } else {
          lastDonationFormatted = date.toLocaleDateString('en-IN', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          });
        }
      }

      inventory.push({
        bloodType,
        units: totalUnits,
        availableDonors: availableCount,
        status,
        trend: `+${availableCount}`, // Available donors ready to donate
        lastDonation: lastDonationFormatted,
        expiring: '0 units', // Can be calculated based on blood expiry logic (42 days for whole blood)
        trendUp: availableCount > 0
      });
    }

    return NextResponse.json({
      inventory,
      totalUnits: inventory.reduce((sum, item) => sum + item.units, 0),
      totalAvailableDonors: inventory.reduce((sum, item) => sum + item.availableDonors, 0),
      criticalStock: inventory.filter(item => item.status === 'Critical').length,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching blood inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blood inventory' },
      { status: 500 }
    );
  }
}
