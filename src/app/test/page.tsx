'use client';

import { useState } from 'react';
import { GradientBackground } from '@/app/components/ui/nanny/backgrounds/GradientBackground';
import { HalfBackground } from '@/app/components/ui/nanny/backgrounds/HalfBackground';
import { PageHeader } from '@/app/components/ui/nanny/PageHeader';
import { TabBar } from '@/app/components/ui/nanny/TabBar';
import { ShareRequestCard } from '@/app/components/ui/nanny/cards/ShareRequestCard';

type Tab = 'requests' | 'available';

export default function TestPage() {
  const [activeTab, setActiveTab] = useState<Tab>('requests');

  return (
    <GradientBackground>
      <PageHeader title="Nanny Sharing" />
      
      <HalfBackground>
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="p-4 space-y-4 overflow-y-auto" style={{ height: 'calc(85.7vh - 120px)' }}>
          <ShareRequestCard
            date="OCT 22"
            time="8am-2pm"
            nannyName="Bruna Chow"
            availableSpots={3}
            hasActivity={true}
          />
          <ShareRequestCard
            date="OCT 22"
            time="8am-2pm"
            nannyName="Bruna Chow"
            availableSpots={3}
            hasActivity={true}
          />
          <ShareRequestCard
            date="OCT 22"
            time="8am-2pm"
            nannyName="Bruna Chow"
            availableSpots={3}
          />
        </div>
      </HalfBackground>
    </GradientBackground>
  );
}