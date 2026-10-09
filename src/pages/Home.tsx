import React, { useState } from 'react';
import { UploadBox } from '../components/UploadBox';
import { DocumentPreview } from '../components/DocumentPreview';
import { AnalysisResult } from '../components/AnalysisResult';
import { ApprovalModal } from '../components/ApprovalModal';
import { DocumentAnalysis, ActionEntity, AccessibilityPreferences } from '../types';
import { analyzeDocument, executeCopilotAction } from '../services/api';
import { AlertCircle, ArrowLeft, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

interface HomeProps {
  preferences: AccessibilityPreferences;
  onAnalysisSaved: (analysis: DocumentAnalysis) => void;
  selectedLanguage: string;
}

export const Home: React.FC<HomeProps> = ({
  preferences,
  onAnalysisSaved,
  selectedLanguage,
}) => {
  const [currentAnalysis, setCurrentAnalysis] = useState<DocumentAnalysis | null>(null);
  const [currentPreviewImage, setCurrentPreviewImage] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<ActionEntity | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isExecutingAction, setIsExecutingAction] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleAnalyze = async (payload: {
    image?: string;
    textContext?: string;
    fileName: string;
    simplificationLevel: string;
    userQuestion?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentPreviewImage(payload.image);

    try {
      const result = await analyzeDocument({
        image: payload.image,
        textContext: payload.textContext,
        fileName: payload.fileName,
        targetLanguage: selectedLanguage,
        simplificationLevel: payload.simplificationLevel,
        userQuestion: payload.userQuestion,
      });

      // Preserve preview image in result
      result.imageUrl = payload.image;
      setCurrentAnalysis(result);
      onAnalysisSaved(result);

      // Auto read aloud if preference enabled
      if (preferences.autoReadAloud && 'speechSynthesis' in window) {
        setTimeout(() => {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(result.audioScript || result.plainLanguageSummary);
          utterance.rate = preferences.textToSpeechSpeed || 1.0;
          window.speechSynthesis.speak(utterance);
        }, 500);
      }
    } catch (err: any) {
      console.error('Error analyzing document:', err);
      setErrorMessage(err.message || 'Failed to analyze document.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestApproval = (action: ActionEntity) => {
    setPendingAction(action);
    setIsApprovalModalOpen(true);
  };

  const handleConfirmAction = async (actionId: string, updatedParams: Record<string, any>) => {
    if (!currentAnalysis) return;

    setIsExecutingAction(true);
    try {
      const action = currentAnalysis.actionSequence.find((a) => a.id === actionId);
      if (!action) return;

      const res = await executeCopilotAction({
        actionId,
        tool: action.tool,
        toolParameters: updatedParams,
        userApproved: true,
      });

      // Update action status in local analysis state
      const updatedSequence = currentAnalysis.actionSequence.map((a) => {
        if (a.id === actionId) {
          return {
            ...a,
            status: 'executed' as const,
            toolParameters: updatedParams,
            executedAt: new Date().toLocaleTimeString(),
            executionResult: res.message,
          };
        }
        return a;
      });

      const updatedAnalysis = {
        ...currentAnalysis,
        actionSequence: updatedSequence,
      };

      setCurrentAnalysis(updatedAnalysis);
      onAnalysisSaved(updatedAnalysis);
      setIsApprovalModalOpen(false);
      setPendingAction(null);

      // Show toast
      setSuccessToast(res.message);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      alert(`Action could not be completed: ${err.message}`);
    } finally {
      setIsExecutingAction(false);
    }
  };

  const handleReset = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentAnalysis(null);
    setCurrentPreviewImage(undefined);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-bold">{successToast}</span>
        </div>
      )}

      {/* Error Message Box */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold">Notice:</span> {errorMessage}
          </div>
        </div>
      )}

      {/* Main View: Upload vs Analysis Result */}
      {!currentAnalysis ? (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> PS02 Accessibility Copilot
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Turn complex documents into simple, actionable steps
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Designed for visual, reading, cognitive, and language barriers. Upload notices, medical forms, transit alerts, or bills — AccessMate AI explains them clearly and helps you act with your approval.
            </p>
          </div>

          <UploadBox
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            selectedLanguage={selectedLanguage}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Back & New Document Action Bar */}
          <div className="flex items-center justify-between pb-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Upload Another Document</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Start Fresh</span>
            </button>
          </div>

          {/* Dual Column Layout: Left Inspector, Right Breakdown & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Visual Inspector Column */}
            <div className="lg:col-span-5 space-y-4">
              <DocumentPreview
                imageUrl={currentPreviewImage || currentAnalysis.imageUrl}
                title={currentAnalysis.fileName}
                urgency={currentAnalysis.urgency}
              />
            </div>

            {/* Analysis & Actions Column */}
            <div className="lg:col-span-7 space-y-6">
              <AnalysisResult
                analysis={currentAnalysis}
                onRequestApproval={handleRequestApproval}
                speechSpeed={preferences.textToSpeechSpeed}
              />
            </div>
          </div>
        </div>
      )}

      {/* Human In The Loop Approval Modal */}
      <ApprovalModal
        action={pendingAction}
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirm={handleConfirmAction}
        isExecuting={isExecutingAction}
      />
    </div>
  );
};
