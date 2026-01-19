import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const db = mongoose.connection.db;
    if (!db) {
      console.error('Database connection not available');
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }

    const campDetailsCollection = db.collection('campdetails');
    const bloodCampsCollection = db.collection('bloodcamps');

    console.log('Fetching registrations for email:', currentUser.email);

    // Get all camp registrations for this donor using email
    const registrations = await campDetailsCollection
      .find({ email: currentUser.email })
      .sort({ createdAt: -1 })
      .toArray();

    console.log('Found registrations:', registrations.length);
    if (registrations.length > 0) {
      console.log('Sample registration:', JSON.stringify(registrations[0], null, 2));
    }

    // Enrich registrations with camp details
    const enrichedRegistrations = await Promise.all(
      registrations.map(async (reg: any) => {
        const camp = await bloodCampsCollection.findOne({
          _id: new mongoose.Types.ObjectId(reg.campId)
        });

        console.log('Camp for registration:', camp?.name);

        return {
          _id: reg._id.toString(),
          campName: camp?.name || 'Unknown Camp',
          campDate: camp?.date || reg.createdAt,
          location: camp?.location
            ? `${camp.location.city}, ${camp.location.state}`
            : 'Location not available',
          status: reg.status || 'registered',
          registeredAt: reg.createdAt,
        };
      })
    );

    console.log('Enriched registrations:', enrichedRegistrations.length);

    return NextResponse.json({ registrations: enrichedRegistrations }, { status: 200 });

  } catch (error) {
    console.error('Get camp registrations error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch camp registrations' },
      { status: 500 }
    );
  }
}
