export type UrgencyLevel = 'urgent' | 'moderate' | 'informational';

export type ActionCategory = 
  | 'reminder' 
  | 'calendar' 
  | 'call' 
  | 'form_fill' 
  | 'checklist' 
  | 'map' 
  | 'draft_reply';

export interface ActionEntity {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  category: ActionCategory;
  urgency: 'urgent' | 'normal' | 'optional';
  requiresApproval: boolean;
  status: 'pending' | 'approved' | 'executed' | 'dismissed';
  tool: 'create_reminder' | 'add_calendar_event' | 'copy_contact' | 'draft_reply' | 'mark_checklist' | 'open_directions';
  toolParameters: {
    title?: string;
    date?: string;
    time?: string;
    notes?: string;
    contact?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    templateText?: string;
    [key: string]: any;
  };
  executedAt?: string;
  executionResult?: string;
}

export interface DocumentAnalysis {
  id: string;
  fileName: string;
  fileType: string;
  imageUrl?: string;
  timestamp: string;
  documentType: string;
  urgency: UrgencyLevel;
  plainLanguageSummary: string;
  readingGradeLevel: string;
  originalLanguage: string;
  targetLanguage: string;
  translatedSummary: string;
  translatedDocumentType: string;
  keyEntities: {
    datesAndDeadlines: Array<{
      label: string;
      date: string;
      description: string;
      isCritical?: boolean;
    }>;
    locations: Array<{
      name: string;
      address?: string;
      notes?: string;
    }>;
    requiredDocuments: Array<{
      id: string;
      name: string;
      description: string;
      completed: boolean;
    }>;
    financials: Array<{
      label: string;
      amount: string;
      dueDate?: string;
    }>;
    contacts: Array<{
      name: string;
      role?: string;
      phoneOrEmail: string;
    }>;
  };
  actionSequence: ActionEntity[];
  audioScript: string;
}

export interface AccessibilityPreferences {
  fontSizeScale: number; // 100, 125, 150, 175
  theme: 'standard' | 'high-contrast-dark' | 'yellow-on-black' | 'cream-comfort';
  dyslexiaFont: boolean;
  textToSpeechSpeed: number; // 0.8, 1.0, 1.2
  autoReadAloud: boolean;
  simplificationLevel: 'simple' | 'very_simple_esl' | 'structured_bullets';
  defaultLanguage: string;
}

export interface ReminderItem {
  id: string;
  actionId: string;
  title: string;
  dueDateTime: string;
  notes: string;
  status: 'active' | 'completed';
  createdAt: string;
}
