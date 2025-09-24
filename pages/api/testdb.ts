import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/db';
import { users } from '../../lib/schema';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Test query
    const result = await db.select().from(users).limit(1);
    res.json({ 
      success: true, 
      message: 'Database connected!',
      userCount: result.length 
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}