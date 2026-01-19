import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const db = mongoose.connection.db;
    const campDetailsCollection = db?.collection('campdetails');

    if (!campDetailsCollection) {
      throw new Error('Database connection error');
    }

    const query: any = {
      ngoId: new mongoose.Types.ObjectId(currentUser.id)
    };

    if (status && status !== 'all') {
      query.status = status;
    }

    const donors = await campDetailsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ donors }, { status: 200 });

  } catch (error) {
    console.error('Get donor registrations error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch donor registrations' },
      { status: 500 }
    );
  }
}
