interface TabBarProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex border-b border-neutral-100">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-1 py-4 text-center font-bold text-lg transition-colors relative ${
            activeTab === tab ? 'text-neutral-900' : 'text-neutral-300'
          }`}
        >
          {tab}
          {activeTab === tab && (
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full"
              style={{
                width: '80px',
                background: 'linear-gradient(90deg, #3373CC 0%, #9DEE95 100%)',
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}