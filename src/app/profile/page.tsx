import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SignOutButton } from '@clerk/nextjs';

import { db } from '@/db/index';
import { surveyData } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function getSurveyData(userId: string) {
  // query DB directly from server component
  const rows = await db.select().from(surveyData).where(eq(surveyData.userId, userId));
  return rows[0] ?? null;
}

export default async function Profile() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in'); // fixed redirect
  }

  const user = await currentUser();
  
  // Fetch survey data directly from DB
  const surveyData = await getSurveyData(userId);

  return (
    <div style={{ padding: '20px', color: '#000' }}> {/* set page text to black */}
      <h1 style={{ color: '#000' }}>Profile Page</h1>
      <p style={{ color: '#000' }}>Welcome, {user?.firstName || 'User'}!</p>
      <p style={{ color: '#000' }}>User ID: {userId}</p>
      
      {surveyData ? (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', color: '#000', backgroundColor: '#fff' }}>
          <h2 style={{ color: '#000' }}>Your Survey Information</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#000' }}>Personal Info</h3>
            <p style={{ color: '#000' }}><strong>Name:</strong> {surveyData.firstName} {surveyData.lastName}</p>
            <p style={{ color: '#000' }}><strong>Phone:</strong> {surveyData.phoneNumber}</p>
            <p style={{ color: '#000' }}><strong>Address:</strong> {surveyData.address}, {surveyData.city} {surveyData.zipCode}</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#000' }}>Children</h3>
            {surveyData.children?.map((child: { name: string; age: string }, index: number) => (
              <p key={index} style={{ color: '#000' }}><strong>Child {index + 1}:</strong> {child.name}, Age {parseInt(child.age, 10)}</p>
            ))}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#000' }}>Health & Safety</h3>
            {surveyData.allergies && <p style={{ color: '#000' }}><strong>Allergies:</strong> {surveyData.allergies}</p>}
            {surveyData.medicalConditions && <p style={{ color: '#000' }}><strong>Medical Conditions:</strong> {surveyData.medicalConditions}</p>}
            {surveyData.learningBehavioral && <p style={{ color: '#000' }}><strong>Learning & Behavioral:</strong> {surveyData.learningBehavioral}</p>}
            {surveyData.additionalNotes && <p style={{ color: '#000' }}><strong>Additional Notes:</strong> {surveyData.additionalNotes}</p>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#000' }}>Preferences</h3>
            <p style={{ color: '#000' }}><strong>Language:</strong> {surveyData.language}</p>
            <p style={{ color: '#000' }}><strong>Budget:</strong> {surveyData.budget}</p>
            {surveyData.certificates && surveyData.certificates.length > 0 && (
              <p style={{ color: '#000' }}><strong>Required Certificates:</strong> {surveyData.certificates.join(', ')}</p>
            )}
          </div>

          <Link href="/survey">
            <button style={{ 
              padding: '10px 20px', 
              backgroundColor: '#4F46E5', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              marginRight: '10px'
            }}>
              Update Survey
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#000', borderRadius: '10px', color: '#fff' }}>
          <h3 style={{ color: '#fff' }}>Complete Your Profile Setup</h3>
          <p style={{ color: '#fff' }}>Please complete the survey to help us find the best daycare options for you.</p>
          <Link href="/survey">
            <button style={{ 
              padding: '10px 20px', 
              backgroundColor: '#4F46E5', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px' 
            }}>
              Complete Setup Survey
            </button>
          </Link>
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <SignOutButton>
          <button style={{ 
            padding: '10px 20px', 
            backgroundColor: '#EF4444', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px' 
          }}>
            Log Out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}