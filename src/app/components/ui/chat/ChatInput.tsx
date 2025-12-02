import { useState, FormEvent } from 'react';
import { IoSend } from 'react-icons/io5';

type ChatInputProps = {
  onSend: (message: string) => Promise<void>;
  isSending: boolean;
  placeholder?: string;
};

export function ChatInput({ onSend, isSending, placeholder = 'Type a message...' }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSending) return;

    await onSend(text.trim());
    setText('');
  };

  return (
    <div className="border-t bg-white px-4 py-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          disabled={isSending}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!text.trim() || isSending}
          className="w-12 h-12 bg-[#3373CC] text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2859a3] transition-colors"
        >
          {isSending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <IoSend className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}