'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type SurveyData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  children: Array<{ name: string; age: string }>;
  address: string;
  city: string;
  zipCode: string;
  allergies: string;
  medicalConditions: string;
  learningBehavioral: string;
  additionalNotes: string;
  language: string;
  certificates: string[];
  budget: string;
};

export default function Survey() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    children: [{ name: '', age: '' }],
    address: '',
    city: '',
    zipCode: '',
    allergies: '',
    medicalConditions: '',
    learningBehavioral: '',
    additionalNotes: '',
    language: 'English',
    certificates: [],
    budget: ''
  });

  const addChild = () => {
    setSurveyData(prev => ({
      ...prev,
      children: [...prev.children, { name: '', age: '' }]
    }));
  };

  const removeChild = (index: number) => {
    if (surveyData.children.length > 1) {
      setSurveyData(prev => ({
        ...prev,
        children: prev.children.filter((_, i) => i !== index)
      }));
    }
  };

  const updateChild = (index: number, field: 'name' | 'age', value: string) => {
    setSurveyData(prev => ({
      ...prev,
      children: prev.children.map((child, i) => 
        i === index ? { ...child, [field]: value } : child
      )
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData),
        credentials: 'include' // ensure auth cookies are sent to the API
      });

      if (response.ok) {
        console.log('Survey data saved to database!');
        router.push('/profile');
      } else {
        // log server response for debugging
        const text = await response.text();
        console.error('Failed to save survey data', response.status, text);
      }
    } catch (error) {
      console.error('Error saving survey data:', error);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    color: 'black', // Added black text color
    backgroundColor: 'white'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '60px',
    resize: 'vertical' as const
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#4F46E5', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '30px',
        width: '100%',
        maxWidth: '400px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button onClick={() => router.back()} style={{ position: 'absolute', left: '20px', top: '20px', background: 'none', border: 'none', fontSize: '18px' }}>
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Tandem</h1>
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            {currentStep}/5
          </div>
          <div style={{ 
            height: '4px', 
            backgroundColor: '#E5E7EB', 
            borderRadius: '2px', 
            marginTop: '10px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              height: '100%', 
              backgroundColor: '#4F46E5', 
              width: `${(currentStep / 5) * 100}%`,
              transition: 'width 0.3s'
            }} />
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div>
            <h2>Let&apos;s set up your account information!</h2>
            <div style={{ marginBottom: '15px' }}>
              <label>First Name</label>
              <input 
                type="text"
                value={surveyData.firstName}
                onChange={(e) => setSurveyData(prev => ({ ...prev, firstName: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Last Name</label>
              <input 
                type="text"
                value={surveyData.lastName}
                onChange={(e) => setSurveyData(prev => ({ ...prev, lastName: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Phone Number</label>
              <input 
                type="tel"
                value={surveyData.phoneNumber}
                onChange={(e) => setSurveyData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                style={inputStyle}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2>Tell us a little about your family</h2>
            <div style={{ marginBottom: '15px' }}>
              <label>Number of children:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <span style={{ padding: '5px 10px', backgroundColor: '#4F46E5', color: 'white', borderRadius: '15px' }}>
                  {surveyData.children.length}
                </span>
                <button onClick={addChild} style={{ backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px' }}>
                  +
                </button>
              </div>
            </div>
            {surveyData.children.map((child, index) => (
              <div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Child {index + 1} Name</label>
                    <input 
                      type="text"
                      value={child.name}
                      onChange={(e) => updateChild(index, 'name', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Age</label>
                    <input 
                      type="number"
                      value={child.age}
                      onChange={(e) => updateChild(index, 'age', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>
                {surveyData.children.length > 1 && (
                  <button 
                    onClick={() => removeChild(index)}
                    style={{ 
                      backgroundColor: '#EF4444', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '3px', 
                      padding: '5px 10px',
                      fontSize: '12px'
                    }}
                  >
                    Remove Child
                  </button>
                )}
              </div>
            ))}
            <button onClick={addChild} style={{ color: '#4F46E5', background: 'none', border: 'none', fontSize: '14px' }}>
              + Insert more child info
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2>Share your location to get personalized recommendations for your area.</h2>
            <div style={{ marginBottom: '15px' }}>
              <label>Street Address</label>
              <input 
                type="text"
                value={surveyData.address}
                onChange={(e) => setSurveyData(prev => ({ ...prev, address: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>City</label>
              <input 
                type="text"
                value={surveyData.city}
                onChange={(e) => setSurveyData(prev => ({ ...prev, city: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Zip Code</label>
              <input 
                type="text"
                value={surveyData.zipCode}
                onChange={(e) => setSurveyData(prev => ({ ...prev, zipCode: e.target.value }))}
                style={inputStyle}
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2>Help us keep your child safe and comfortable</h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              Please share any important information about your child&apos;s needs.
            </p>
            <div style={{ marginBottom: '15px' }}>
              <label>Allergies</label>
              <textarea 
                value={surveyData.allergies}
                onChange={(e) => setSurveyData(prev => ({ ...prev, allergies: e.target.value }))}
                style={textareaStyle}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Medical conditions</label>
              <textarea 
                value={surveyData.medicalConditions}
                onChange={(e) => setSurveyData(prev => ({ ...prev, medicalConditions: e.target.value }))}
                style={textareaStyle}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Learning & Behavioral</label>
              <textarea 
                value={surveyData.learningBehavioral}
                onChange={(e) => setSurveyData(prev => ({ ...prev, learningBehavioral: e.target.value }))}
                style={textareaStyle}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Additional Notes</label>
              <textarea 
                value={surveyData.additionalNotes}
                onChange={(e) => setSurveyData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                style={{ ...textareaStyle, minHeight: '80px' }}
              />
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div>
            <h2>Your Daycare Preferences</h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              Please provide important information about your child&apos;s needs.
            </p>
            <div style={{ marginBottom: '15px' }}>
              <label>Language</label>
              <select 
                value={surveyData.language}
                onChange={(e) => setSurveyData(prev => ({ ...prev, language: e.target.value }))}
                style={inputStyle}
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>Other</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Certificate</label>
              <div style={{ marginTop: '10px' }}>
                {['CPR & First-Aid Certified', 'Early Childhood Education (ECE)', 'Special Needs Experience', 'Others'].map(cert => (
                  <label key={cert} style={{ display: 'block', marginBottom: '5px', color: 'black' }}>
                    <input 
                      type="checkbox" 
                      checked={surveyData.certificates.includes(cert)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSurveyData(prev => ({ ...prev, certificates: [...prev.certificates, cert] }));
                        } else {
                          setSurveyData(prev => ({ ...prev, certificates: prev.certificates.filter(c => c !== cert) }));
                        }
                      }}
                      style={{ marginRight: '8px' }}
                    />
                    {cert}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Budget</label>
              <input 
                type="text"
                value={surveyData.budget}
                onChange={(e) => setSurveyData(prev => ({ ...prev, budget: e.target.value }))}
                style={inputStyle}
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
          {currentStep > 1 && (
            <button 
              onClick={prevStep}
              style={{ padding: '10px 20px', backgroundColor: '#E5E7EB', border: 'none', borderRadius: '25px' }}
            >
              Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {currentStep < 5 ? (
            <button 
              onClick={nextStep}
              style={{ padding: '10px 20px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '25px' }}
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              style={{ padding: '10px 20px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '25px' }}
            >
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}