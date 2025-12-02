

import Image from 'next/image';

export function EmptyMessages() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-16">
      <div className="w-64 h-64 mb-8">
       <Image src="/nanny/noNannyYet.svg" alt="No messages illustration" width={256} height={256} />
      </div>
      <h2 className="text-2xl font-bold text-black mb-2">No message yet</h2>
    </div>
  );
}