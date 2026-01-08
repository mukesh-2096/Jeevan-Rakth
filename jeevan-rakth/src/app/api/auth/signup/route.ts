import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import ContactDetails from '@/models/ContactDetails';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    console.log('Signup API called');
    
    await connectDB();
    console.log('Database connected');

    const body = await req.json();
    console.log('Request body:', { ...body, password: '***', confirmPassword: '***' });
    
    const { name, email, phone, password, confirmPassword, role } = body;

    // Validation
    if (!name || !email || !password || !confirmPassword || !role) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Password validation: minimum 6 characters with at least one special character
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordRegex.test(password)) {
      console.log('Password validation failed');
      return NextResponse.json(
        { error: 'Password must be at least 6 characters and contain at least one special character' },
        { status: 400 }
      );
    }

    // Check if phone is required for donor and ngo
    if ((role === 'donor' || role === 'ngo') && !phone) {
      console.log('Phone number required but not provided');
      return NextResponse.json(
        { error: 'Phone number is required for donors and NGOs' },
        { status: 400 }
      );
    }

    // Check if user already exists with this email
    console.log('Checking if user exists:', email.toLowerCase());
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('User already exists with this email');
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Check if phone number is already registered (only if phone is provided)
    if (phone) {
      const existingPhone = await User.findOne({ phone: phone.trim() });
      if (existingPhone) {
        console.log('User already exists with this phone number');
        return NextResponse.json(
          { error: 'An account with this phone number already exists' },
          { status: 400 }
        );
      }
    }

    // Hash password
    console.log('Hashing password');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    console.log('Creating user');
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone: phone || undefined,
      password: hashedPassword,
      role,
    });

    // Create contact details in separate collection with role
    console.log('Creating contact details');
    try {
      await ContactDetails.create({
        userId: user._id,
        role: user.role,
      });
      console.log('Contact details created successfully');
    } catch (contactError: any) {
      // If contact details already exist, just log and continue
      if (contactError.code === 11000) {
        console.log('Contact details already exist for this user, skipping...');
      } else {
        // If it's a different error, log it but don't fail the signup
        console.error('Contact details creation error (non-critical):', contactError);
      }
    }

    console.log('User and contact details created successfully:', user._id);
    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    console.error('Error stack:', error.stack);
    
    // More specific error messages
    let errorMessage = 'Something went wrong. Please try again.';
    
    if (error.name === 'ValidationError') {
      errorMessage = 'Validation error: ' + Object.values(error.errors).map((e: any) => e.message).join(', ');
    } else if (error.code === 11000) {
      // Handle duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'email') {
        errorMessage = 'An account with this email already exists';
      } else if (field === 'phone') {
        errorMessage = 'An account with this phone number already exists';
      } else {
        errorMessage = 'This account already exists';
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
