type Tab = 'requests' | 'available';

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex border-b border-neutral-100">
      <button
        onClick={() => onTabChange('requests')}
        className={`flex-1 py-4 text-center font-bold text-lg transition-colors relative ${
          activeTab === 'requests' ? 'text-neutral-900' : 'text-neutral-300'
        }`}
      >
        Requests
        {activeTab === 'requests' && (
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full"
            style={{
              width: '80px',
              background: 'linear-gradient(90deg, #3373CC 0%, #9DEE95 100%)',
            }}
          />
        )}
      </button>
      <button
        onClick={() => onTabChange('available')}
        className={`flex-1 py-4 text-center font-bold text-lg transition-colors relative ${
          activeTab === 'available' ? 'text-neutral-900' : 'text-neutral-300'
        }`}
      >
        Available
        {activeTab === 'available' && (
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full"
            style={{
              width: '80px',
              background: 'linear-gradient(90deg, #3373CC 0%, #9DEE95 100%)',
            }}
          />
        )}
      </button>
    </div>
  );
}