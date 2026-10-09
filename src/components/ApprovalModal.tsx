import React, { useState, useEffect } from 'react';
import { ShieldCheck, Calendar, Clock, Bell, Mail, FileText, Check, X, AlertCircle, Edit3 } from 'lucide-react';
import { ActionEntity } from '../types';

interface ApprovalModalProps {
  action: ActionEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (actionId: string, updatedParams: Record<string, any>) => void;
  isExecuting?: boolean;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  action,
  isOpen,
  onClose,
  onConfirm,
  isExecuting = false,
}) => {
  const [params, setParams] = useState<Record<string, any>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (action) {
      setParams({ ...action.toolParameters });
      setIsEditing(false);
    }
  }, [action]);

  if (!isOpen || !action) return null;

  const getToolIcon = () => {
    switch (action.category) {
      case 'reminder':
        return <Bell className="w-6 h-6 text-indigo-600" />;
      case 'calendar':
        return <Calendar className="w-6 h-6 text-indigo-600" />;
      case 'draft_reply':
        return <Mail className="w-6 h-6 text-indigo-600" />;
      default:
        return <FileText className="w-6 h-6 text-indigo-600" />;
    }
  };

  const handleParamChange = (field: string, value: string) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    onConfirm(action.id, params);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="approval-title"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-indigo-500 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 text-left space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Human-In-The-Loop Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
              {getToolIcon()}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Human-in-the-Loop Approval Required
              </div>
              <h3 id="approval-title" className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {action.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Explanation */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
          <p className="font-medium">{action.description}</p>
        </div>

        {/* Tool Parameters & Editable Form */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Copilot Tool Parameters: {action.tool}</span>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditing ? 'Done Editing' : 'Edit Details'}
            </button>
          </div>

          <div className="space-y-3 bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            {/* Title parameter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Event / Reminder Title
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={params.title || ''}
                  onChange={(e) => handleParamChange('title', e.target.value)}
                  className="w-full text-sm p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              ) : (
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {params.title || action.title}
                </div>
              )}
            </div>

            {/* Date and Time if applicable */}
            {(params.date || isEditing) && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Scheduled Date
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={params.date || ''}
                      onChange={(e) => handleParamChange('date', e.target.value)}
                      className="w-full text-sm p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  ) : (
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      {params.date || 'Not set'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Time Alert
                  </label>
                  {isEditing ? (
                    <input
                      type="time"
                      value={params.time || '09:00'}
                      onChange={(e) => handleParamChange('time', e.target.value)}
                      className="w-full text-sm p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  ) : (
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      {params.time || '09:00 AM'}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes / Details */}
            {params.notes && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Context / Notes
                </label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={params.notes || ''}
                    onChange={(e) => handleParamChange('notes', e.target.value)}
                    className="w-full text-sm p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                    {params.notes}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Safety & Trust Callout */}
        <div className="flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>
            AccessMate AI operates under PS02 Human-in-the-Loop safety: no reminders or external actions are created without your explicit authorization.
          </span>
        </div>

        {/* Decision Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel / Keep Pending
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isExecuting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {isExecuting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Executing Tool...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Approve & Execute Action</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
