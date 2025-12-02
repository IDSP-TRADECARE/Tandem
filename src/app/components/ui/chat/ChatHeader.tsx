import { useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';

type ChatHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
};

export function ChatHeader({ title, subtitle, onBack }: ChatHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b px-4 py-4 flex items-center gap-3 shadow-sm">
      <button
        onClick={handleBack}
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
      >
        <IoChevronBack className="w-6 h-6 text-gray-700" />
      </button>
      <div className="flex-1">
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
    </div>
  );
}