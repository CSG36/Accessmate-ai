import React, { useState } from 'react';
import { History as HistoryIcon, Search, Trash2, Calendar, FileText, CheckCircle2, Download, ExternalLink, ArrowRight } from 'lucide-react';
import { DocumentAnalysis } from '../types';

interface HistoryProps {
  historyItems: DocumentAnalysis[];
  onSelectDocument: (doc: DocumentAnalysis) => void;
  onClearHistory: () => void;
}

export const History: React.FC<HistoryProps> = ({
  historyItems,
  onSelectDocument,
  onClearHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = historyItems.filter((item) =>
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.plainLanguageSummary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Document & Action History
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review past analyses, completed checklist steps, and approved copilot reminders
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      {historyItems.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search saved documents, dates, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {historyItems.length === 0 ? 'No documents analyzed yet' : 'No matching documents found'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Upload or snap a picture of a document in the Home tab to analyze and create copilot action reminders.
          </p>
        </div>
      ) : (
        /* List of Saved Documents */
        <div className="space-y-4">
          {filteredItems.map((doc) => {
            const executedCount = doc.actionSequence?.filter((a) => a.status === 'executed').length || 0;
            const totalCount = doc.actionSequence?.length || 0;

            return (
              <div
                key={doc.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-400 transition-all shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {doc.documentType}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-xs text-slate-500">
                        {new Date(doc.timestamp).toLocaleDateString()} {new Date(doc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {doc.fileName}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {executedCount}/{totalCount} Actions Done
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectDocument(doc)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Open Document</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                  {doc.plainLanguageSummary}
                </p>

                {/* Executed Tools Summary */}
                {doc.actionSequence?.some((a) => a.status === 'executed') && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {doc.actionSequence
                      .filter((a) => a.status === 'executed')
                      .map((act) => (
                        <span
                          key={act.id}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>{act.title}</span>
                        </span>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
