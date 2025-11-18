'use client';
import { useState } from 'react';
import { GradientBackgroundFull } from "../components/ui/backgrounds/GradientBackgroundFull";
import { HalfBackground } from "../components/ui/backgrounds/HalfBackground";
import { TabBar } from "../components/ui/backgrounds/TabBar";
import { 
  getHeadersForView, 
  getTopPositionForView,
  createMonthHandlers
} from '../components/calendar/viewHelpers';
import {DateCardContainer } from '../components/ui/calendar/DateCard';

// Calendar layout
const tabs = ['Today', 'Weekly', 'Monthly'];

export default function TestPage() {
  
  const [activeTab, setActiveTab] = useState<'Today' | 'Weekly' | 'Monthly'>('Today');
  const [selectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { handlePreviousMonth, handleNextMonth } = createMonthHandlers(currentMonth, setCurrentMonth);
  const topPosition = getTopPositionForView(activeTab);

  return (
    <GradientBackgroundFull>
      {/* Render headers based on active tab */}
      {getHeadersForView(activeTab, selectedDate, currentMonth, {
        onPrevMonth: handlePreviousMonth,
        onNextMonth: handleNextMonth,
      })}

      <HalfBackground topPosition={topPosition}>
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as 'Today' | 'Weekly' | 'Monthly')}
        />
        <div className="">
          {activeTab === 'Today' && (
            <div>
            <DateCardContainer 
              cards={[
                { id: 1, text: "No Childcare booked !" , isEmpty: true, isWork: false, type: activeTab, onClick: () => {} },
                { id: 2, text: "2 appointments today", isEmpty: false, isWork: false, type: activeTab, onClick: () => {} },
                { id: 3, text: "Work from 9 AM to 5 PM", isEmpty: false, isWork: true, type: activeTab, onClick: () => {} },
              ]}
            />
            </div>
          )}

          {activeTab === 'Weekly' && (
            <div>
              <DateCardContainer 
              cards={[
                { id: 1, text: "No Childcare booked !" , isEmpty: true, isWork: false, type: activeTab, onClick: () => {} },
                { id: 2, text: "2 appointments today", isEmpty: false, isWork: false, type: activeTab, onClick: () => {} },
                { id: 3, text: "Work from 9 AM to 5 PM", isEmpty: false, isWork: true, type: activeTab, onClick: () => {} },
              ]}
            />
            </div>
          )}

          {activeTab === 'Monthly' && (
            <div>
              <DateCardContainer 
              cards={[
                { id: 1, text: "No Childcare booked !" , isEmpty: true, isWork: false, type: activeTab, onClick: () => {} },
                { id: 2, text: "2 appointments today", isEmpty: false, isWork: false, type: activeTab, onClick: () => {} },
                { id: 3, text: "Work from 9 AM to 5 PM", isEmpty: false, isWork: true, type: activeTab, onClick: () => {} },
              ]}
            />
            </div>
          )}
        </div>
      </HalfBackground>
    </GradientBackgroundFull>
  );
}