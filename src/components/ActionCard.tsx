import React from 'react';
import { Bell, Calendar, Mail, CheckCircle2, Clock, Check, ArrowRight, ShieldCheck, Download, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { ActionEntity } from '../types';

interface ActionCardProps {
  action: ActionEntity;
  index: number;
  totalSteps: number;
  onRequestApproval: (action: ActionEntity) => void;
  onDirectExecute?: (action: ActionEntity) => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  action,
  index,
  totalSteps,
  onRequestApproval,
  onDirectExecute,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const getCategoryIcon = () => {
    switch (action.category) {
      case 'reminder':
        return <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'calendar':
        return <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'draft_reply':
        return <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const isExecuted = action.status === 'executed';

  // Export .ics calendar file if action was executed and tool produced calendar content
  const handleDownloadIcs = () => {
    const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AccessMate AI//EN\nBEGIN:VEVENT\nSUMMARY:${action.toolParameters?.title || action.title}\nDESCRIPTION:${action.description}\nDTSTART:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\nSTATUS:CONFIRMED\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${action.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`rounded-2xl border-2 transition-all p-4 sm:p-5 relative ${
        isExecuted
          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500/60 dark:border-emerald-800'
          : action.urgency === 'urgent'
          ? 'bg-white dark:bg-slate-900 border-amber-400 dark:border-amber-600 shadow-sm'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        {/* Step Badge and Title */}
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isExecuted
                ? 'bg-emerald-100 dark:bg-emerald-900/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                : 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
            }`}
          >
            {isExecuted ? <Check className="w-5 h-5 font-bold" /> : getCategoryIcon()}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Step {action.stepNumber || index + 1} of {totalSteps}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                {action.category.replace('_', ' ')}
              </span>
              {action.urgency === 'urgent' && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300">
                  Time Critical
                </span>
              )}
            </div>

            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
              {action.title}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {action.description}
            </p>
          </div>
        </div>

        {/* Action Button or Completed Pill */}
        <div className="sm:self-center shrink-0 flex items-center gap-2">
          {isExecuted ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-xs">
                <Check className="w-4 h-4" /> Executed
              </span>
              {(action.category === 'reminder' || action.category === 'calendar') && (
                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="p-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1"
                  title="Download .ICS for Apple / Google / Outlook Calendar"
                  aria-label="Download calendar event file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add to Calendar</span>
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onRequestApproval(action)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all"
              aria-label={`Review and approve action: ${action.title}`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Review & Approve</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Parameter Context */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold flex items-center gap-1"
        >
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {isExpanded ? 'Hide Details' : 'View Tool Action Details'}
        </button>

        {action.toolParameters?.date && (
          <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Target: {action.toolParameters.date} {action.toolParameters.time || ''}
          </span>
        )}
      </div>

      {isExpanded && (
        <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 animate-in fade-in">
          <div><strong className="text-slate-700 dark:text-slate-300">Tool:</strong> <code className="text-indigo-600 dark:text-indigo-400">{action.tool}</code></div>
          {action.toolParameters?.notes && (
            <div><strong className="text-slate-700 dark:text-slate-300">Notes:</strong> {action.toolParameters.notes}</div>
          )}
          {action.executionResult && (
            <div className="text-emerald-700 dark:text-emerald-400 font-medium pt-1">
              Result: {action.executionResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
