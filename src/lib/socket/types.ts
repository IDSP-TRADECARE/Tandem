import { NannyShare } from '@/db/schema';

/**
 * Room/share identifier can be DB serial (number) or route param (string).
 */
export type ShareId = string | number;

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

export interface ServerToClientEvents {
  'member-joined': (data: MemberJoinedData) => void;

  /**
   * share-updated may be emitted with the full NannyShare or a small payload { id }
   * (the client code should handle either shape)
   */
  'share-updated': (payload: ShareUpdatedPayload) => void;

  'message-received': (message: Message) => void;

  // Real-time nanny request flow
  'nanny:request': (payload: { shareId: ShareId; request: JoinRequest }) => void;
  'nanny:request-accepted': (payload: { shareId: ShareId; userId?: string | null; requestId?: string }) => void;
  'nanny:request-rejected': (payload: { shareId: ShareId; requestId: string }) => void;
}

export interface ClientToServerEvents {
  'join-share': (shareId: ShareId) => void;
  'leave-share': (shareId: ShareId) => void;
  'member-joined': (data: MemberJoinedData) => void;

  /**
   * Client can send a share-updated notification carrying either a full share or a small payload.
   * (Server handlers can decide what to broadcast.)
   */
  'share-updated': (data: ShareUpdatedData) => void;

  'message-sent': (data: MessageSentData) => void;

  // Client emits for request flow
  'nanny:request': (payload: { shareId: ShareId; request: JoinRequest }) => void;
  'nanny:request-accepted': (payload: { shareId: ShareId; userId?: string | null; requestId?: string }) => void;
  'nanny:request-rejected': (payload: { shareId: ShareId; requestId: string }) => void;
}

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
  shareId: ShareId;
  share?: NannyShare;
}

export interface MessageSentData {
  shareId: ShareId;
  message: Message;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}