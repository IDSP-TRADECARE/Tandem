import { IoChatbubblesOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

export function PageHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-6 pb-6">
      <h1 className="text-4xl font-bold text-white">{title}</h1>
      <button 
        onClick={() => router.push('/messages')}
        className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors"
      >
        <IoChatbubblesOutline className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}