'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { IoSearchOutline, IoChevronBack } from 'react-icons/io5';
import { GradientBackgroundFull } from '../components/ui/backgrounds/GradientBackgroundFull';
import { HalfBackground } from '../components/ui/backgrounds/HalfBackground';
import { BottomNav } from '../components/Layout/BottomNav';
import { MessageListItem } from '../components/ui/messages/MessageListItem';
import { MessageFilters } from '../components/ui/messages/MessageFilters';
import { EmptyMessages } from '../components/ui/messages/EmptyMessages';

type ConversationType = {
  id: string;
  type: 'direct' | 'group';
  name: string;
  avatar?: string | null;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
};

export default function MessagesPage() {
  const router = useRouter();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'direct' | 'group'>('all');
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchConversations = async () => {
      try {
        // Fetch all nanny shares where user is a member
        const response = await fetch('/api/nanny/my-shares');
        const data = await response.json();
        const shares = data.shares || [];

        // Convert shares to conversations
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const shareConversations: ConversationType[] = shares.map((share: any) => {
          const lastMsg = share.messages?.[share.messages.length - 1];
          return {
            id: share.id.toString(),
            type: 'group' as const,
            name: `${new Date(share.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${share.startTime}`,
            avatar: null,
            lastMessage: lastMsg?.content || 'No messages yet',
            timestamp: lastMsg?.timestamp || share.createdAt || new Date().toISOString(),
            unreadCount: 0, // Could implement unread tracking
          };
        });

        setConversations(shareConversations);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || conv.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleConversationClick = (id: string) => {
    router.push(`/nanny/${id}/chat`);
  };

  return (
    <GradientBackgroundFull>
      <div className="p-6 flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center"
        >
          <IoChevronBack className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-4xl font-bold text-white">Message</h1>
      </div>

      <HalfBackground>
        <div className="h-full flex flex-col pb-24">
          {/* Search Bar */}
          <div className="px-4 pt-6 pb-4">
            <div className="relative">
              <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <MessageFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

          {/* Message List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <EmptyMessages />
            ) : (
              <div>
                {filteredConversations.map((conv) => (
                  <MessageListItem
                    key={conv.id}
                    id={conv.id}
                    name={conv.name}
                    avatar={conv.avatar}
                    lastMessage={conv.lastMessage}
                    timestamp={conv.timestamp}
                    unreadCount={conv.unreadCount}
                    isGroupChat={conv.type === 'group'}
                    onClick={handleConversationClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <BottomNav />
      </HalfBackground>
    </GradientBackgroundFull>
  );
}