import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BloodCamp from '@/models/BloodCamp';
import { getCurrentUser } from '@/lib/auth';

// GET /api/ngo/camps - Get all blood camps for the logged-in NGO
export async function GET(request: NextRequest) {
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

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    // Build query
    const query: any = { ngoId: user.id };
    if (status && status !== 'all') {
      query.status = status;
    }

    // Fetch camps
    const camps = await BloodCamp.find(query)
      .sort({ date: -1, createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await BloodCamp.countDocuments(query);

    return NextResponse.json({
      success: true,
      camps,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + camps.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching blood camps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blood camps' },
      { status: 500 }
    );
  }
}

// POST /api/ngo/camps - Create a new blood camp
export async function POST(request: NextRequest) {
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
        { error: 'Only NGOs can create blood camps' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Log the received data for debugging
    console.log('Received camp data:', JSON.stringify(body, null, 2));
    console.log('Current user:', { id: user.id, role: user.role, email: user.email });

    // Validate required fields
    const {
      name,
      location,
      date,
      startTime,
      endTime,
      targetDonors,
      contactPerson,
    } = body;

    if (!name || !location || !date || !startTime || !endTime || !targetDonors || !contactPerson) {
      console.log('Validation failed:', {
        name: !!name,
        location: !!location,
        date: !!date,
        startTime: !!startTime,
        endTime: !!endTime,
        targetDonors: !!targetDonors,
        contactPerson: !!contactPerson,
      });
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: {
            name: !!name,
            location: !!location,
            date: !!date,
            startTime: !!startTime,
            endTime: !!endTime,
            targetDonors: !!targetDonors,
            contactPerson: !!contactPerson,
          }
        },
        { status: 400 }
      );
    }

    // Validate location object has required fields
    if (!location.address || !location.city || !location.state) {
      return NextResponse.json(
        { error: 'Location must include address, city, and state' },
        { status: 400 }
      );
    }

    // Validate contactPerson object has required fields
    if (!contactPerson.name || !contactPerson.phone) {
      return NextResponse.json(
        { error: 'Contact person must include name and phone' },
        { status: 400 }
      );
    }

    // Validate date is in the future
    const campDate = new Date(date);
    if (campDate < new Date()) {
      return NextResponse.json(
        { error: 'Camp date must be in the future' },
        { status: 400 }
      );
    }

    // Create new blood camp
    const newCamp = new BloodCamp({
      ...body,
      ngoId: user.id,
      currentDonors: 0,
      volunteers: body.volunteers || 0,
      status: 'upcoming',
      registeredDonors: [],
    });

    await newCamp.save();

    return NextResponse.json({
      success: true,
      message: 'Blood camp created successfully',
      camp: newCamp,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blood camp:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create blood camp' },
      { status: 500 }
    );
  }
}
