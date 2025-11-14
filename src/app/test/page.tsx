'use client';
import { useState } from 'react';
import { GradientBackgroundFull } from "../components/ui/backgrounds/GradientBackgroundFull";
import { HalfBackground } from "../components/ui/backgrounds/HalfBackground";
import { TabBar } from "../components/ui/backgrounds/TabBar";
import { DateHeader } from '../components/ui/calendar/DateHeader';


// Calendar layout
const tabs = ['Today', 'Weekly', 'Monthly'];



export default function TestPage() {
  const [activeTab, setActiveTab] = useState('Today');

  return (
    <GradientBackgroundFull>
      
      <DateHeader type="date" date={new Date()} />

      <DateHeader type="today" date={new Date()} />


      <HalfBackground>
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div>


          {activeTab === 'Today' && (
          <div>
            <h2>Today View</h2>
          </div>
          )}

          {activeTab === 'Weekly' && (
          <div>
            <h2>Weekly View</h2>
          </div>
          )}

          {activeTab === 'Monthly' && (
          <div>
            <h2>Monthly View</h2>
          </div>
          )}


          
        </div>
      </HalfBackground>
    </GradientBackgroundFull>
  );
}