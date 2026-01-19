import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BloodCamp from '@/models/BloodCamp';
import { getCurrentUser } from '@/lib/auth';
import mongoose from 'mongoose';

// GET /api/ngo/camps/[id] - Get a specific blood camp
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'ngo') {
      return NextResponse.json(
        { error: 'Only NGOs can access this endpoint' },
        { status: 403 }
      );
    }

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid camp ID' },
        { status: 400 }
      );
    }

    const camp = await BloodCamp.findOne({
      _id: id,
      ngoId: user.id,
    }).lean();

    if (!camp) {
      return NextResponse.json(
        { error: 'Blood camp not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      camp,
    });
  } catch (error) {
    console.error('Error fetching blood camp:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blood camp' },
      { status: 500 }
    );
  }
}

// PATCH /api/ngo/camps/[id] - Update a blood camp
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'ngo') {
      return NextResponse.json(
        { error: 'Only NGOs can update blood camps' },
        { status: 403 }
      );
    }

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid camp ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Find the camp
    const camp = await BloodCamp.findOne({
      _id: id,
      ngoId: user.id,
    });

    if (!camp) {
      return NextResponse.json(
        { error: 'Blood camp not found' },
        { status: 404 }
      );
    }

    // Don't allow updating completed or cancelled camps
    if (camp.status === 'completed' || camp.status === 'cancelled') {
      return NextResponse.json(
        { error: `Cannot update ${camp.status} camps` },
        { status: 400 }
      );
    }

    // Validate date if being updated
    if (body.date) {
      const campDate = new Date(body.date);
      if (campDate < new Date() && camp.status === 'upcoming') {
        return NextResponse.json(
          { error: 'Camp date must be in the future' },
          { status: 400 }
        );
      }
    }

    // Update the camp
    const updatedCamp = await BloodCamp.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Blood camp updated successfully',
      camp: updatedCamp,
    });
  } catch (error: any) {
    console.error('Error updating blood camp:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update blood camp' },
      { status: 500 }
    );
  }
}

// DELETE /api/ngo/camps/[id] - Delete a blood camp
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'ngo') {
      return NextResponse.json(
        { error: 'Only NGOs can delete blood camps' },
        { status: 403 }
      );
    }

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid camp ID' },
        { status: 400 }
      );
    }

    const camp = await BloodCamp.findOneAndDelete({
      _id: id,
      ngoId: user.id,
    });

    if (!camp) {
      return NextResponse.json(
        { error: 'Blood camp not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blood camp deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blood camp:', error);
    return NextResponse.json(
      { error: 'Failed to delete blood camp' },
      { status: 500 }
    );
  }
}
