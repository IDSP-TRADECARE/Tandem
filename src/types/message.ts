export type MessageStep = 'prompt' | 'form' | 'preview' | 'edit' | 'send';

export interface MessageData {
  userName: string;
  childcareOrgName: string;
  contactInfo: string;
  customMessage: string;
  generatedMessage: string;
}

export interface MessageTemplateType {
  subject: string;
  body: string;
}

export interface SavedMessage {
  id: number;
  userName: string;
  userContact: string;
  childcareOrgName: string;
  messageBody: string;
  sentVia?: string | null;
  status?: string;
  createdAt: Date;
  sentAt?: Date | null;
}