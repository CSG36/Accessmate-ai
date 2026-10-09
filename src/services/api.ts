import { DocumentAnalysis, AccessibilityPreferences, ActionEntity } from '../types';

export async function analyzeDocument(payload: {
  image?: string;
  textContext?: string;
  fileName?: string;
  targetLanguage?: string;
  simplificationLevel?: string;
  userQuestion?: string;
}): Promise<DocumentAnalysis> {
  const res = await fetch('/api/analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Analysis failed' }));
    throw new Error(errorData.error || `HTTP ${res.status}: Failed to analyze document`);
  }

  return res.json();
}

export async function executeCopilotAction(payload: {
  actionId: string;
  tool: string;
  toolParameters: Record<string, any>;
  userApproved: boolean;
}): Promise<{
  success: boolean;
  message: string;
  reminder?: any;
  icsContent?: string;
  draft?: string;
  resultData?: any;
}> {
  const res = await fetch('/api/actions/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Action execution failed' }));
    throw new Error(err.error || 'Action could not be executed.');
  }

  return res.json();
}

export async function getPreferences(): Promise<AccessibilityPreferences> {
  const res = await fetch('/api/preferences');
  if (!res.ok) throw new Error('Failed to load preferences');
  return res.json();
}

export async function savePreferences(preferences: Partial<AccessibilityPreferences>): Promise<void> {
  await fetch('/api/preferences', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  });
}

export async function getReminders(): Promise<any[]> {
  const res = await fetch('/api/tools/reminders');
  if (!res.ok) return [];
  return res.json();
}
