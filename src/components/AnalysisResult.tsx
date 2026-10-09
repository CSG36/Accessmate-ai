import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Calendar, 
  MapPin, 
  FileCheck, 
  DollarSign, 
  Phone, 
  Languages, 
  Sparkles, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Share2,
  Printer
} from 'lucide-react';
import { DocumentAnalysis, ActionEntity } from '../types';
import { ActionCard } from './ActionCard';

interface AnalysisResultProps {
  analysis: DocumentAnalysis;
  onRequestApproval: (action: ActionEntity) => void;
  speechSpeed?: number;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({
  analysis,
  onRequestApproval,
  speechSpeed = 1.0,
}) => {
  const [activeTab, setActiveTab] = useState<'plain' | 'translated' | 'entities'>('plain');
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [isPausedSpeech, setIsPausedSpeech] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  // Initialize checklist items from required documents
  useEffect(() => {
    if (analysis.keyEntities?.requiredDocuments) {
      const initial: Record<string, boolean> = {};
      analysis.keyEntities.requiredDocuments.forEach((doc) => {
        initial[doc.id] = doc.completed || false;
      });
      setChecklist(initial);
    }
  }, [analysis]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Web Speech API Text-to-Speech handler
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in this browser.');
      return;
    }

    if (isPlayingSpeech) {
      if (isPausedSpeech) {
        window.speechSynthesis.resume();
        setIsPausedSpeech(false);
      } else {
        window.speechSynthesis.pause();
        setIsPausedSpeech(true);
      }
    } else {
      window.speechSynthesis.cancel();
      const textToRead = activeTab === 'translated' 
        ? `${analysis.translatedDocumentType}. ${analysis.translatedSummary}`
        : analysis.audioScript || analysis.plainLanguageSummary;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = speechSpeed;

      // Select matching voice if possible
      const voices = window.speechSynthesis.getVoices();
      if (activeTab === 'translated' && analysis.targetLanguage) {
        const langCode = analysis.targetLanguage.toLowerCase().substring(0, 2);
        const matchVoice = voices.find(v => v.lang.toLowerCase().startsWith(langCode));
        if (matchVoice) utterance.voice = matchVoice;
      }

      utterance.onstart = () => {
        setIsPlayingSpeech(true);
        setIsPausedSpeech(false);
      };
      utterance.onend = () => {
        setIsPlayingSpeech(false);
        setIsPausedSpeech(false);
      };
      utterance.onerror = () => {
        setIsPlayingSpeech(false);
        setIsPausedSpeech(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingSpeech(false);
    setIsPausedSpeech(false);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {analysis.documentType}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                {analysis.readingGradeLevel}
              </span>
              {analysis.urgency === 'urgent' && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> High Priority
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2">
              Accessible Document Breakdown
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Analyzed with Gemma 4 Accessibility Reasoning • Step-by-step action plan ready
            </p>
          </div>

          {/* Accessible Audio Reader Controls */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-850 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={handleToggleSpeech}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm ${
                isPlayingSpeech && !isPausedSpeech
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              aria-label={isPlayingSpeech && !isPausedSpeech ? 'Pause voice reader' : 'Listen to document summary'}
            >
              {isPlayingSpeech && !isPausedSpeech ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Voice</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Listen Aloud</span>
                </>
              )}
            </button>

            {isPlayingSpeech && (
              <button
                type="button"
                onClick={handleStopSpeech}
                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300"
                title="Stop reading"
                aria-label="Stop text to speech"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              title="Print high contrast summary"
              aria-label="Print accessible summary"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode Tabs (Plain English vs Translated vs Key Data) */}
        <div className="flex gap-2 pt-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('plain')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'plain'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Plain English Breakdown
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('translated')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'translated'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>Translated ({analysis.targetLanguage})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('entities')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'entities'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Extracted Key Data ({analysis.keyEntities?.datesAndDeadlines?.length || 0} dates)
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="mt-4">
          {activeTab === 'plain' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200 dark:border-slate-800 leading-relaxed text-slate-800 dark:text-slate-200 text-base sm:text-lg">
              <p>{analysis.plainLanguageSummary}</p>
            </div>
          )}

          {activeTab === 'translated' && (
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 leading-relaxed text-slate-800 dark:text-slate-200 text-base sm:text-lg">
              <div className="text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-2 uppercase tracking-wide">
                Document Category: {analysis.translatedDocumentType}
              </div>
              <p>{analysis.translatedSummary}</p>
            </div>
          )}

          {activeTab === 'entities' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Deadlines */}
              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" /> Important Deadlines
                </h4>
                <div className="space-y-2">
                  {analysis.keyEntities?.datesAndDeadlines?.map((d, i) => (
                    <div key={i} className="text-xs sm:text-sm">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {d.label}: <span className="font-mono text-indigo-600 dark:text-indigo-400">{d.date}</span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-400">{d.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" /> Locations & Offices
                </h4>
                <div className="space-y-2">
                  {analysis.keyEntities?.locations?.map((loc, i) => (
                    <div key={i} className="text-xs sm:text-sm">
                      <div className="font-bold text-slate-900 dark:text-white">{loc.name}</div>
                      {loc.address && <div className="text-slate-600 dark:text-slate-400">{loc.address}</div>}
                      {loc.notes && <div className="text-xs text-blue-600 dark:text-blue-400">{loc.notes}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Entities Quick Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Required Documents Checklist */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>Required Documents to Bring</span>
          </div>
          {analysis.keyEntities?.requiredDocuments?.length ? (
            <div className="space-y-2.5">
              {analysis.keyEntities.requiredDocuments.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => toggleChecklistItem(doc.id)}
                  className="w-full flex items-start gap-2.5 text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                >
                  {checklist[doc.id] ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  )}
                  <div className="text-xs">
                    <div className={`font-semibold ${checklist[doc.id] ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {doc.name}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">{doc.description}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No specific physical documents required.</p>
          )}
        </div>

        {/* Financials & Costs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
            <DollarSign className="w-4 h-4 text-amber-600" />
            <span>Financials & Fees</span>
          </div>
          {analysis.keyEntities?.financials?.length ? (
            <div className="space-y-3">
              {analysis.keyEntities.financials.map((fin, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{fin.label}</div>
                    {fin.dueDate && <div className="text-[11px] text-slate-500">Due: {fin.dueDate}</div>}
                  </div>
                  <div className="text-sm font-extrabold text-amber-700 dark:text-amber-400 font-mono">
                    {fin.amount}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No payment or fee required mentioned.</p>
          )}
        </div>

        {/* Contact Numbers */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
            <Phone className="w-4 h-4 text-blue-600" />
            <span>Important Contacts</span>
          </div>
          {analysis.keyEntities?.contacts?.length ? (
            <div className="space-y-2.5">
              {analysis.keyEntities.contacts.map((contact, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{contact.name}</div>
                    {contact.role && <div className="text-[11px] text-slate-500">{contact.role}</div>}
                  </div>
                  <a
                    href={`tel:${contact.phoneOrEmail}`}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    {contact.phoneOrEmail}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No direct phone numbers found in document.</p>
          )}
        </div>
      </div>

      {/* Step-by-Step Action Plan Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Intelligent Action Plan (PS02 Copilot)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Each action requires your explicit approval before execution
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
            {analysis.actionSequence?.length || 0} Actions Planned
          </span>
        </div>

        <div className="space-y-3">
          {analysis.actionSequence?.map((action, index) => (
            <ActionCard
              key={action.id}
              action={action}
              index={index}
              totalSteps={analysis.actionSequence.length}
              onRequestApproval={onRequestApproval}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
