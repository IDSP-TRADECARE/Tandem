import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { userName, childcareOrgName, contactInfo, additionalDetails } = await request.json();

    if (!userName || !childcareOrgName || !contactInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = `Write a professional, warm message for a parent reaching out to a nanny provider.
    Parent's name: ${userName}
    nanny organization: ${childcareOrgName}
    Parent's contact information: ${contactInfo}
    Additional details or questions: ${additionalDetails || 'General inquiry about services'}
    Create a concise, friendly professional message (150-200 words) that:
    - Introduces the parent warmly
    - Expresses interest in their nanny services
    - Asks about availability, scheduling options, and fees
    - Mentions flexible scheduling needs if relevant
    - Ends with a polite request for more information
    Write ONLY the message body, no subject line.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that writes professional, warm, and concise nanny services inquiry messages for parents. Write naturally and warmly.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
    });

    const generatedMessage = completion.choices[0]?.message?.content || '';

    if (!generatedMessage) {
      throw new Error('No message generated');
    }

    return NextResponse.json(
      { 
        success: true, 
        message: generatedMessage.trim()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating message with Groq:', error);
    return NextResponse.json(
      { error: 'Failed to generate message. Please try again.' },
      { status: 500 }
    );
  }
}