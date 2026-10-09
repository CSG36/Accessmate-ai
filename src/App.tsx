import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Sparkles, 
  FileText, 
  History as HistoryIcon, 
  Settings as SettingsIcon, 
  Globe, 
  Type, 
  Contrast, 
  Volume2, 
  ShieldCheck, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { Home } from './pages/Home';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { LanguageSelector } from './components/LanguageSelector';
import { DocumentAnalysis, AccessibilityPreferences } from './types';
import { getPreferences, savePreferences } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'settings'>('home');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [documentHistory, setDocumentHistory] = useState<DocumentAnalysis[]>([]);
  
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    fontSizeScale: 100,
    theme: 'standard',
    dyslexiaFont: false,
    textToSpeechSpeed: 1.0,
    autoReadAloud: false,
    simplificationLevel: 'simple',
    defaultLanguage: 'English',
  });

  // Load preferences from API / localStorage on mount
  useEffect(() => {
    getPreferences()
      .then((saved) => {
        if (saved) {
          setPreferences((prev) => ({ ...prev, ...saved }));
          if (saved.defaultLanguage) setSelectedLanguage(saved.defaultLanguage);
        }
      })
      .catch(() => {
        // Fallback to local
      });

    // Load local history if available
    const savedHistory = localStorage.getItem('accessmate_history');
    if (savedHistory) {
      try {
        setDocumentHistory(JSON.parse(savedHistory));
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }, []);

  // Sync theme and accessibility classes to document body
  useEffect(() => {
    const body = document.body;
    body.classList.remove('theme-high-contrast', 'theme-yellow-contrast', 'theme-cream', 'font-dyslexic');

    if (preferences.theme === 'high-contrast-dark') {
      body.classList.add('theme-high-contrast');
    } else if (preferences.theme === 'yellow-on-black') {
      body.classList.add('theme-yellow-contrast');
    } else if (preferences.theme === 'cream-comfort') {
      body.classList.add('theme-cream');
    }

    if (preferences.dyslexiaFont) {
      body.classList.add('font-dyslexic');
    }
  }, [preferences.theme, preferences.dyslexiaFont]);

  const handleUpdatePreferences = (updated: Partial<AccessibilityPreferences>) => {
    const next = { ...preferences, ...updated };
    setPreferences(next);
    if (updated.defaultLanguage) {
      setSelectedLanguage(updated.defaultLanguage);
    }
    savePreferences(updated).catch(() => {});
  };

  const handleAnalysisSaved = (analysis: DocumentAnalysis) => {
    setDocumentHistory((prev) => {
      const filtered = prev.filter((d) => d.id !== analysis.id);
      const updated = [analysis, ...filtered];
      localStorage.setItem('accessmate_history', JSON.stringify(updated.slice(0, 20)));
      return updated;
    });
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your saved document history?')) {
      setDocumentHistory([]);
      localStorage.removeItem('accessmate_history');
    }
  };

  // Quick font +/- scaling buttons
  const adjustFontSize = (delta: number) => {
    const nextScale = Math.min(175, Math.max(100, preferences.fontSizeScale + delta));
    handleUpdatePreferences({ fontSizeScale: nextScale });
  };

  const toggleHighContrast = () => {
    const nextTheme = preferences.theme === 'standard' ? 'high-contrast-dark' : 'standard';
    handleUpdatePreferences({ theme: nextTheme });
  };

  return (
    <div 
      className="min-h-screen flex flex-col transition-colors duration-200"
      style={{ fontSize: `${preferences.fontSizeScale}%` }}
    >
      {/* Persistent Accessibility Quick-Bar */}
      <div 
        className="bg-slate-900 text-slate-100 border-b border-slate-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-sm select-none"
        role="region"
        aria-label="Accessibility quick controls"
      >
        <div className="flex items-center gap-3">
          <span className="font-bold flex items-center gap-1.5 text-indigo-300">
            <Eye className="w-3.5 h-3.5" />
            <span>Accessibility Tools:</span>
          </span>

          {/* Quick Font Size Scaling */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={() => adjustFontSize(-25)}
              className="px-2 py-0.5 rounded hover:bg-slate-700 font-bold text-slate-200"
              title="Decrease text size"
              aria-label="Decrease text size"
            >
              A-
            </button>
            <span className="px-1.5 font-mono text-[11px] text-slate-300">
              {preferences.fontSizeScale}%
            </span>
            <button
              type="button"
              onClick={() => adjustFontSize(25)}
              className="px-2 py-0.5 rounded hover:bg-slate-700 font-bold text-slate-200"
              title="Increase text size"
              aria-label="Increase text size"
            >
              A+
            </button>
          </div>

          {/* Quick High Contrast Switch */}
          <button
            type="button"
            onClick={toggleHighContrast}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
              preferences.theme !== 'standard'
                ? 'bg-yellow-400 text-black border-yellow-500 font-bold'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
            title="Toggle high contrast color mode"
            aria-label="Toggle high contrast mode"
          >
            <Contrast className="w-3.5 h-3.5" />
            <span>High Contrast</span>
          </button>

          {/* Dyslexia Font Toggle */}
          <button
            type="button"
            onClick={() => handleUpdatePreferences({ dyslexiaFont: !preferences.dyslexiaFont })}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold hidden sm:flex items-center gap-1 transition-all ${
              preferences.dyslexiaFont
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
            title="Toggle dyslexia-friendly font"
            aria-label="Toggle dyslexia-friendly font"
          >
            <Type className="w-3.5 h-3.5" />
            <span>Dyslexia Font</span>
          </button>
        </div>

        {/* Global Language Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 hidden sm:inline">Translate & Explain in:</span>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onSelectLanguage={(lang) => {
              setSelectedLanguage(lang);
              handleUpdatePreferences({ defaultLanguage: lang });
            }}
          />
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Copilot Badge */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Eye className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  AccessMate<span className="text-indigo-600 dark:text-indigo-400"> AI</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Gemma 4
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Accessibility Copilot • PS02
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'home'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              aria-current={activeTab === 'home' ? 'page' : undefined}
            >
              <FileText className="w-4 h-4" />
              <span>Copilot</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all relative ${
                activeTab === 'history'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              aria-current={activeTab === 'history' ? 'page' : undefined}
            >
              <HistoryIcon className="w-4 h-4" />
              <span>History</span>
              {documentHistory.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center">
                  {documentHistory.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              aria-current={activeTab === 'settings' ? 'page' : undefined}
            >
              <SettingsIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Preferences</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <Home
            preferences={preferences}
            onAnalysisSaved={handleAnalysisSaved}
            selectedLanguage={selectedLanguage}
          />
        )}

        {activeTab === 'history' && (
          <History
            historyItems={documentHistory}
            onSelectDocument={(doc) => {
              setActiveTab('home');
            }}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === 'settings' && (
          <Settings
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
          />
        )}
      </main>

      {/* Accessible Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">
              PS02 Intelligent Copilot Architecture: Strict Human-in-the-Loop approval for all actions.
            </span>
          </div>
          <div>
            Built with Gemma 4 multimodal reasoning & accessibility-first universal design.
          </div>
        </div>
      </footer>
    </div>
  );
}
