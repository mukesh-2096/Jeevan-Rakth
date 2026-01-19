import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';
import User from '@/models/User';

// GET - Fetch all donor registrations for the NGO
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

    const registrations = await Registration.find({
      organization: currentUser.id,
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ registrations });

  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}
