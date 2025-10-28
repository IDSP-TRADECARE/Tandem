export function PageHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between px-6 pb-6">
      <h1 className="text-4xl font-bold text-white">{title}</h1>
      <button className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    </div>
  );
}