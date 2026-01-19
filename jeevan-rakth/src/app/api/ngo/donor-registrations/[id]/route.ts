import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { status } = await request.json();
    const params = await context.params;
    const db = mongoose.connection.db;
    const campDetailsCollection = db?.collection('campdetails');

    if (!campDetailsCollection) {
      throw new Error('Database connection error');
    }

    const result = await campDetailsCollection.updateOne(
      { 
        _id: new mongoose.Types.ObjectId(params.id),
        ngoId: new mongoose.Types.ObjectId(currentUser.id)
      },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Donor registration not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Status updated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Update donor registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update donor registration' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const params = await context.params;
    const db = mongoose.connection.db;
    const campDetailsCollection = db?.collection('campdetails');

    if (!campDetailsCollection) {
      throw new Error('Database connection error');
    }

    const result = await campDetailsCollection.deleteOne({
      _id: new mongoose.Types.ObjectId(params.id),
      ngoId: new mongoose.Types.ObjectId(currentUser.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Donor registration not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Donor registration deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Delete donor registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete donor registration' },
      { status: 500 }
    );
  }
}
