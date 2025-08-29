export interface Analysis {
  label: string;
  confidence: number;
  recommendation?: string;
}

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  image?: string;
  analysis?: Analysis;
  status: 'sending' | 'sent';
}
