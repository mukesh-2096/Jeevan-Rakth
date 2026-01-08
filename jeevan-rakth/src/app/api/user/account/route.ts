import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import ContactDetails from '@/models/ContactDetails';
import { cookies } from 'next/headers';

// UPDATE account (name and phone)
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, phone } = body;

    // Validation
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Phone number must be 10 digits' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if phone number is already in use by another user
    if (phone) {
      const existingUser = await User.findOne({ 
        phone, 
        email: { $ne: user.email } 
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Phone number already in use' },
          { status: 400 }
        );
      }
    }

    // Update user account (name and phone)
    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      { name: name.trim(), phone: phone || undefined },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Account updated successfully',
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || '',
        role: updatedUser.role,
      },
    });
  } catch (error: unknown) {
    console.error('Account update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update account';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE account
export async function DELETE() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Delete user from database
    const deletedUser = await User.findOneAndDelete({ email: user.email });

    if (!deletedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Clear authentication cookie
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error: unknown) {
    console.error('Account deletion error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete account';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
