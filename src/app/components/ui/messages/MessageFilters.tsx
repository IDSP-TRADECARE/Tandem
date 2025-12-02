type MessageFiltersProps = {
  activeFilter: 'all' | 'direct' | 'group';
  onFilterChange: (filter: 'all' | 'direct' | 'group') => void;
};

export function MessageFilters({ activeFilter, onFilterChange }: MessageFiltersProps) {
  const filters = [
    { id: 'all' as const, label: 'All' },
    { id: 'direct' as const, label: 'Direct' },
    { id: 'group' as const, label: 'Group Chats' },
  ];

  return (
    <div className="flex gap-2 px-4 mb-4">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === filter.id
              ? 'bg-[#3373CC] text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
            activeFilter === filter.id ? 'bg-white' : 'bg-[#92F189]'
          }`} />
          {filter.label}
        </button>
      ))}
    </div>
  );
}