import { NannyShare } from '@/db/schema';

export interface ServerToClientEvents {
  'member-joined': (data: MemberJoinedData) => void;
  'share-updated': (share: NannyShare) => void;
  'message-received': (message: Message) => void;
}

export interface ClientToServerEvents {
  'join-share': (shareId: string) => void;
  'leave-share': (shareId: string) => void;
  'member-joined': (data: MemberJoinedData) => void;
  'share-updated': (data: ShareUpdatedData) => void;
  'message-sent': (data: MessageSentData) => void;
}

export interface MemberJoinedData {
  shareId: string;
  member: {
    userId: string;
    name: string;
    kidsCount: number;
    joinedAt: string;
  };
}

export interface ShareUpdatedData {
  shareId: string;
  share: NannyShare;
}

export interface MessageSentData {
  shareId: string;
  message: Message;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}