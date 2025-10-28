import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { nannyShares } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      date,
      location,
      startTime,
      endTime,
      price,
      certificates,
      maxSpots,
      creatorName, // For now, we'll pass this from frontend
    } = body;

    // Validation
    if (!date || !location || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields: date, location, startTime, endTime' },
        { status: 400 }
      );
    }

    // Validate maxSpots is multiple of 4 if provided
    if (maxSpots && maxSpots % 4 !== 0) {
      return NextResponse.json(
        { error: 'Max spots must be a multiple of 4' },
        { status: 400 }
      );
    }

    // For now, use a mock user ID (will replace with Clerk auth later)
    const mockUserId = 'user_mock_' + Date.now();

    // Creator automatically joins as first member
    const initialMembers = [{
      userId: mockUserId,
      name: creatorName || 'Anonymous',
      kidsCount: 1,
      joinedAt: new Date().toISOString(),
    }];

    const [newShare] = await db.insert(nannyShares).values({
      creatorId: mockUserId,
      date,
      location,
      startTime,
      endTime,
      price: price || null,
      certificates: certificates || null,
      maxSpots: maxSpots || null,
      members: initialMembers,
    }).returning();

    return NextResponse.json({ 
      success: true, 
      share: newShare 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating nanny share:', error);
    return NextResponse.json(
      { error: 'Failed to create nanny share' },
      { status: 500 }
    );
  }
}