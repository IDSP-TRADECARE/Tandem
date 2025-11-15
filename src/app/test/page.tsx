'use client';
import { useState } from 'react';
import { GradientBackgroundFull } from "../components/ui/backgrounds/GradientBackgroundFull";
import { HalfBackground } from "../components/ui/backgrounds/HalfBackground";
import { TabBar } from "../components/ui/backgrounds/TabBar";
import { 
  getHeadersForView, 
  getHeightForView, 
  createMonthHandlers
} from '../components/calendar/viewHelpers';

// Calendar layout
const tabs = ['Today', 'Weekly', 'Monthly'];

export default function TestPage() {
  
  const [activeTab, setActiveTab] = useState<'Today' | 'Weekly' | 'Monthly'>('Today');
  const [selectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { handlePreviousMonth, handleNextMonth } = createMonthHandlers(currentMonth, setCurrentMonth);
  const halfBackgroundHeight = getHeightForView(activeTab);

  return (
    <GradientBackgroundFull>
      {/* Render headers based on active tab */}
      {getHeadersForView(activeTab, selectedDate, currentMonth, {
        onPrevMonth: handlePreviousMonth,
        onNextMonth: handleNextMonth,
      })}

      <HalfBackground divHeight={halfBackgroundHeight}>
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as 'Today' | 'Weekly' | 'Monthly')}
        />
        <div className="">
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