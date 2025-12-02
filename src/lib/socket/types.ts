/* eslint-disable @typescript-eslint/no-explicit-any */
import { NannyShare } from '@/db/schema';

/**
 * Room/share identifier can be DB serial (number) or route param (string).
 */
export type ShareId = string | number;
export type RoomId = string;

export interface JoinRequest {
  id: string;
  userId?: string;
  name: string;
  kidsCount: number;
  note?: string;
  createdAt: string;
  avatarUrl?: string | null;
}

/**
 * small payload used when we only have the share id (server sometimes emits this)
 */
export type ShareUpdatedPayload = { id: ShareId } | NannyShare;

export interface MemberJoinedData {
  shareId: ShareId;
  member: {
    userId: string;
    name: string;
    kidsCount: number;
    joinedAt: string;
  };
}

export interface ShareUpdatedData {
  id: ShareId;
}

export interface MessageSentData {
  roomId: RoomId; // Can be share-${id} or dm-${roomId}
  message: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
  };
}

export interface ServerToClientEvents {
  'member-joined': (data: MemberJoinedData) => void;
  'share-updated': (data: ShareUpdatedData) => void;
  'message-received': (message: MessageSentData['message']) => void;
  'nanny:request': (data: { shareId: ShareId; request: any }) => void;
  'nanny:request-accepted': (data: { shareId: ShareId; userId?: string; requestId?: string }) => void;
  'nanny:request-rejected': (data: { shareId: ShareId; requestId: string }) => void;
}

export interface ClientToServerEvents {
  'join-share': (shareId: ShareId) => void;
  'leave-share': (shareId: ShareId) => void;
  'join-dm': (roomId: RoomId) => void;
  'leave-dm': (roomId: RoomId) => void;
  'member-joined': (data: MemberJoinedData) => void; // ✅ Added
  'message-sent': (data: MessageSentData) => void;
  'nanny:request': (data: { shareId: ShareId; request: any }) => void;
  'nanny:request-accepted': (data: { shareId: ShareId; userId?: string; requestId?: string }) => void;
  'nanny:request-rejected': (data: { shareId: ShareId; requestId: string }) => void;
}